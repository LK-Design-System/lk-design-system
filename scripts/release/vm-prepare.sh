#!/usr/bin/env bash
# Boot a fresh release guest on server04 and qualify it, without registering a runner.
# A prepared guest has never run a job; vm-register.sh turns it into the run's runner.
set -euo pipefail
source "$(dirname -- "${BASH_SOURCE[0]}")/release-env.sh"
R="${LDS_RELEASE_VM_ROOT}"
if release_host "test -f ${R}/prepared && . ${R}/vm.env && docker ps -q --filter name=\${VM_CONTAINER} | grep -q ."; then
  echo "already_prepared $(release_host cat "${R}/prepared")"; exit 0
fi
# A prepared marker without a running guest (host reboot, manual cleanup) is stale.
release_host "cd ${R}; . ./vm.env; docker rm -f \${VM_CONTAINER} >/dev/null 2>&1; docker network rm \${VM_NETWORK} >/dev/null 2>&1; rm -f vm/runner.qcow2 vm/seed.iso vm/console.log known_hosts scan.tmp prepared; true"
t0=$(date +%s)
# prepare.sh verifies the signed Ubuntu cloud image, boots a new overlay and seed, pins the
# guest host key against the console fingerprint and runs the private-egress qualification.
# It exits 1 without output when another prepare holds prepare.lock.
if ! release_host "cd ${R} && ./prepare.sh > prepare-protected.log 2>&1"; then
  echo 'prepare_failed:' >&2
  release_host "cat ${R}/status.json; tail -n 20 ${R}/prepare-protected.log" >&2 || true
  exit 1
fi
receipt=$(release_host "python3 -c 'import json; r = json.load(open(\"${R}/receipt.json\")); print(\"key=\" + r[\"guestHostKeyFingerprint\"], \"blocked=\" + str(r[\"privateEgressProbes\"]))'")
echo "prepared $(( $(date +%s) - t0 ))s ${receipt}"
