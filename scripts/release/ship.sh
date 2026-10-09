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
published() { gh api "orgs/${LDS_RELEASE_ORG}/packages/npm/lds-$1/versions" --paginate --jq '.[].name' | grep -qx "${VERSION}"; }
for package in core theme product; do
  ! published "${package}" || { echo "already_published: lds-${package}@${VERSION}" >&2; exit 1; }
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
  published "${package}" || { echo "publish_not_visible: lds-${package}@${VERSION}" >&2; wait "${next}" || true; exit 1; }
done
wait "${next}" || true
release_step "shipped ${TAG}: lds-core/theme/product@${VERSION}; next warm VM: $(tail -1 "${LDS_RELEASE_LOG_DIR}/prepare-after-${RUN}.log")"
