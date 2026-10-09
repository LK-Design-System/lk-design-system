#!/usr/bin/env bash
# Unregister the release runner and dispose the guest (wrapper image, base and scripts are kept).
set -euo pipefail
source "$(dirname -- "${BASH_SOURCE[0]}")/release-env.sh"
R="${LDS_RELEASE_VM_ROOT}"
script="set -euo pipefail
IFS= read -r REMOVE_TOKEN
cd /home/runner/actions-runner
test -f .runner || exit 0
./config.sh remove --token \"\$REMOVE_TOKEN\" >/dev/null
unset REMOVE_TOKEN"
if release_host "test -f ${R}/known_hosts"; then
  release_guest "sudo -n bash -c 'cd /home/runner/actions-runner && { ./svc.sh stop; ./svc.sh uninstall; } >/dev/null 2>&1 || true'" || true
  gh api -X POST "orgs/${LDS_RELEASE_ORG}/actions/runners/remove-token" --jq .token \
    | release_host "${R}/guest.sh $(printf '%q' "sudo -n -u runner -H bash -c $(printf '%q' "${script}")")" || true
fi
# If the guest could not deregister itself, remove the offline record through the API.
id=$(gh api "orgs/${LDS_RELEASE_ORG}/actions/runners" --paginate --jq ".runners[] | select(.name==\"${LDS_RELEASE_RUNNER_NAME}\") | .id")
[[ -z "${id}" ]] || gh api -X DELETE "orgs/${LDS_RELEASE_ORG}/actions/runners/${id}" >/dev/null
release_host "cd ${R}; . ./vm.env; docker rm -f \${VM_CONTAINER} >/dev/null 2>&1; docker network rm \${VM_NETWORK} >/dev/null 2>&1; rm -f vm/runner.qcow2 vm/seed.iso known_hosts scan.tmp prepared; true"
release_host_state disposed runner_deregistered_guest_removed
remaining=$(release_runners)
echo "guest disposed; release runners left: ${remaining:-0}"
