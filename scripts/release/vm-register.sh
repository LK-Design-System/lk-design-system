#!/usr/bin/env bash
# Register the prepared guest as the only LDS release runner (token piped, never printed).
set -euo pipefail
source "$(dirname -- "${BASH_SOURCE[0]}")/release-env.sh"
R="${LDS_RELEASE_VM_ROOT}"
release_host "test -f ${R}/prepared" || { echo not_prepared >&2; exit 1; }
existing=$(release_runners)
[[ -z "${existing}" ]] || { printf 'other_release_runners_present: %s\n' "${existing}" >&2; exit 1; }
script="set -euo pipefail
IFS= read -r REGISTRATION_TOKEN
cd /home/runner/actions-runner
test ! -f .runner
./config.sh --unattended --url https://github.com/${LDS_RELEASE_ORG} --token \"\$REGISTRATION_TOKEN\" --runnergroup ${LDS_RELEASE_RUNNER_GROUP} --name ${LDS_RELEASE_RUNNER_NAME} --labels ${LDS_RELEASE_RUNNER_LABEL} --work _work --disableupdate >/dev/null
unset REGISTRATION_TOKEN"
gh api -X POST "orgs/${LDS_RELEASE_ORG}/actions/runners/registration-token" --jq .token \
  | release_host "${R}/guest.sh $(printf '%q' "sudo -n -u runner -H bash -c $(printf '%q' "${script}")")"
release_guest "sudo -n bash -c 'cd /home/runner/actions-runner && ./svc.sh install runner >/dev/null && ./svc.sh start >/dev/null'"
status=""
for _ in $(seq 1 30); do
  status=$(gh api "orgs/${LDS_RELEASE_ORG}/actions/runner-groups/${LDS_RELEASE_RUNNER_GROUP_ID}/runners" \
    --jq ".runners[] | select(.name==\"${LDS_RELEASE_RUNNER_NAME}\") | \"\(.id) \(.status) \([.labels[].name] | join(\",\"))\"")
  [[ "${status}" == *" online "* ]] && break
  sleep 2
done
[[ "${status}" == *" online "* ]] || { echo "runner_not_online: ${status}" >&2; exit 1; }
# The label is the job's only route to this guest; a wrong one leaves the run queued.
[[ ",${status##* }," == *",${LDS_RELEASE_RUNNER_LABEL},"* ]] || { echo "runner_label_mismatch: ${status}" >&2; exit 1; }
release_host "rm -f ${R}/prepared"
release_host_state registered runner_online
echo "runner ${status}"
