#!/usr/bin/env bash
# ship.sh <lds-vX.Y.Z> — publish an existing immutable LDS tag (prefer ship-bg.sh).
# prepared release VM -> register -> one canonical dispatch -> green run
# -> dispose runner/VM, prepare the next warm VM -> confirm the published versions.
set -euo pipefail
source "$(dirname -- "${BASH_SOURCE[0]}")/release-env.sh"
TAG="${1:-}"
[[ "${TAG}" =~ ^lds-v[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z.-]+)?$ ]] \
  || { echo 'usage: ship.sh <lds-vX.Y.Z existing immutable tag>' >&2; exit 2; }
RELEASE_T0=$(date +%s); REPO="${LDS_RELEASE_REPO}"; VERSION="${TAG#lds-v}"
git -C "${LDS_CHECKOUT}" fetch -q origin main "+refs/tags/${TAG}:refs/tags/${TAG}"
SHA=$(git -C "${LDS_CHECKOUT}" rev-parse "${TAG}^{commit}")
git -C "${LDS_CHECKOUT}" merge-base --is-ancestor "${SHA}" origin/main \
  || { echo "release_source_unavailable: ${TAG} is not an ancestor of origin/main" >&2; exit 1; }
# 0 = published, 1 = confirmed absent, every other result = unknown.
# Authentication/transport failures must never authorize VM preparation.
published() {
  local pages state
  if ! pages=$(gh api "orgs/${LDS_RELEASE_ORG}/packages/npm/lds-$1/versions" --paginate --slurp 2>/dev/null); then
    return 2
  fi
  if ! state=$(printf '%s' "${pages}" | node -e '
    try {
      const pages = JSON.parse(require("node:fs").readFileSync(0, "utf8"));
      if (!Array.isArray(pages) || pages.length === 0 || pages.some(page =>
        !Array.isArray(page) || page.some(version => !version || typeof version !== "object"
          || Array.isArray(version) || typeof version.name !== "string" || version.name.length === 0))) {
        process.exit(2);
      }
      process.stdout.write(pages.some(page => page.some(version => version.name === process.argv[1])) ? "present" : "absent");
    } catch {
      process.exit(2);
    }
  ' "${VERSION}" 2>/dev/null && printf ':'); then
    return 2
  fi
  # The suffix keeps unexpected trailing newlines visible to the exact match.
  case "${state}" in
    present:) return 0 ;;
    absent:) return 1 ;;
    *) return 2 ;;
  esac
}
for package in core theme product; do
  if published "${package}"; then
    echo "already_published: lds-${package}@${VERSION}" >&2; exit 1
  else
    availability=$?
    [[ "${availability}" -eq 1 ]] || { echo "package_availability_unknown: lds-${package}@${VERSION}" >&2; exit 1; }
  fi
done
release_step "ship ${TAG} ${SHA:0:8}"

"${RELEASE_DIR}/vm-prepare.sh" | sed 's/^/  vm: /'
# From registration on, the single-use guest must be disposed whatever happens next.
dispose() { "${RELEASE_DIR}/vm-down.sh" | sed 's/^/  vm: /' || true; }
trap dispose EXIT
"${RELEASE_DIR}/vm-register.sh" | sed 's/^/  vm: /'

since=$(date -u +%Y-%m-%dT%H:%M:%SZ)
# The dispatcher re-checks the tag, main ancestry and the online/idle runner before dispatching.
(cd "${LDS_CHECKOUT}" && node scripts/dispatch-package-release.mjs "${TAG}") >/dev/null
RUN=""
for _ in $(seq 1 24); do
  RUN=$(gh run list -R "${REPO}" -w release-packages.yml -e workflow_dispatch -L 5 --json databaseId,createdAt \
    --jq "[.[] | select(.createdAt >= \"${since}\")][0].databaseId // empty")
  [[ -n "${RUN}" ]] && break
  sleep 5
done
[[ -n "${RUN}" ]] || { echo dispatch_not_found >&2; exit 1; }
echo "${RUN} ${TAG} ${SHA}" > "${LDS_RELEASE_LOG_DIR}/last-dispatch"
release_step "dispatched https://github.com/${REPO}/actions/runs/${RUN}"

queued_since=$(date +%s); warned=""
while :; do
  status=$(gh run view "${RUN}" -R "${REPO}" --json status --jq .status 2>/dev/null || true)
  [[ "${status}" == completed ]] && break
  # A run that is never assigned means the runner or its label is wrong; say so instead of waiting silently.
  if [[ "${status}" == queued && -z "${warned}" ]] && (( $(date +%s) - queued_since > 300 )); then
    release_step "still queued after 5m: check the runner label and status (vm-register output above)"; warned=1
  fi
  [[ "${status}" == queued ]] || queued_since=$(date +%s)
  sleep 30
done
conclusion=$(gh run view "${RUN}" -R "${REPO}" --json conclusion --jq .conclusion)
gh run view "${RUN}" -R "${REPO}" --json jobs \
  --jq '.jobs[] | "  job: \(.name): \(.conclusion) \(((.completedAt|fromdateiso8601)-(.startedAt|fromdateiso8601))/60|floor)m"'
release_step "release ${conclusion}"

trap - EXIT
dispose
"${RELEASE_DIR}/vm-prepare.sh" > "${LDS_RELEASE_LOG_DIR}/prepare-after-${RUN}.log" 2>&1 & next=$!
if [[ "${conclusion}" != success ]]; then
  echo "release_failed: https://github.com/${REPO}/actions/runs/${RUN} (fix and re-dispatch the same tag only if nothing was published)" >&2
  wait "${next}" || true; exit 1
fi
for package in core theme product; do
  if published "${package}"; then
    continue
  else
    availability=$?
    if [[ "${availability}" -eq 1 ]]; then
      echo "publish_not_visible: lds-${package}@${VERSION}" >&2
    else
      echo "publish_visibility_unknown: lds-${package}@${VERSION}" >&2
    fi
    wait "${next}" || true; exit 1
  fi
done
wait "${next}" || true
release_step "shipped ${TAG}: lds-core/theme/product@${VERSION}; next warm VM: $(tail -1 "${LDS_RELEASE_LOG_DIR}/prepare-after-${RUN}.log")"
