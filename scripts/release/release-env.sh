# shellcheck shell=bash
# Sourced by the LDS release operator scripts: loads and validates the operator settings.
RELEASE_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
LDS_RELEASE_ENV="${LDS_RELEASE_ENV:-${HOME}/.config/lds-release/release.env}"
if [[ ! -f "${LDS_RELEASE_ENV}" ]]; then
  printf 'release_env_missing: copy %s/release.env.example to %s\n' "${RELEASE_DIR}" "${LDS_RELEASE_ENV}" >&2
  exit 2
fi
# shellcheck disable=SC1090
source "${LDS_RELEASE_ENV}"
for required in LDS_RELEASE_REPO LDS_CHECKOUT LDS_RELEASE_VM_HOST LDS_RELEASE_VM_ROOT \
  LDS_RELEASE_RUNNER_NAME LDS_RELEASE_RUNNER_GROUP LDS_RELEASE_RUNNER_GROUP_ID LDS_RELEASE_RUNNER_LABEL; do
  [[ -n "${!required:-}" && "${!required}" != *'<'* ]] || { printf 'release_env_incomplete: %s\n' "${required}" >&2; exit 2; }
done
# Host policy is repository-owned, not a machine-local fallback setting.
# Reject before creating logs, contacting a server, or dispatching a workflow.
if [[ "${LDS_RELEASE_REPO}" != LK-Design-System/lk-design-system || "${LDS_RELEASE_VM_HOST}" != server04 \
  || "${LDS_RELEASE_RUNNER_NAME}" != lk-lds-release-server04-* \
  || "${LDS_RELEASE_RUNNER_LABEL}" != lk-lds-release-linux-x64 ]]; then
  printf 'release_host_policy_mismatch: use the server04 isolated LDS release guest; no developer-host fallback\n' >&2
  exit 2
fi
LDS_RELEASE_ORG="${LDS_RELEASE_REPO%%/*}"
LDS_RELEASE_LOG_DIR="${LDS_RELEASE_LOG_DIR:-${HOME}/.local/state/lds-release/logs}"
mkdir -p "${LDS_RELEASE_LOG_DIR}"
release_step() { printf '[%s +%ss] %s\n' "$(date +%T)" "$(( $(date +%s) - ${RELEASE_T0:-$(date +%s)} ))" "$*"; }
# Retry only connection setup over the tailnet; a started command is never re-run.
release_host() {
  ssh -o BatchMode=yes -o ConnectTimeout=20 -o ConnectionAttempts=3 -o ServerAliveInterval=15 \
    "${LDS_RELEASE_VM_HOST}" "$@"
}
# Guest SSH through the host's pinned-key helper.
release_guest() { release_host "${LDS_RELEASE_VM_ROOT}/guest.sh $(printf '%q' "$1")"; }
# Record the guest lifecycle in the host status.json that prepare.sh also writes.
release_host_state() {
  release_host "cd ${LDS_RELEASE_VM_ROOT} && python3 - $(printf '%q %q' "$1" "$2")" <<'PY'
import datetime, json, pathlib, sys
status = {
    'state': sys.argv[1],
    'step': sys.argv[2],
    'updatedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(),
    'scope': 'single-use LDS release guest; scripts/release',
}
tmp = pathlib.Path('status.new')
tmp.write_text(json.dumps(status) + '\n')
tmp.replace('status.json')
PY
}
# Every runner carrying the release label, as "id name status".
release_runners() {
  gh api "orgs/${LDS_RELEASE_ORG}/actions/runners" --paginate \
    --jq ".runners[] | select(any(.labels[]; .name==\"${LDS_RELEASE_RUNNER_LABEL}\")) | \"\(.id) \(.name) \(.status)\""
}
