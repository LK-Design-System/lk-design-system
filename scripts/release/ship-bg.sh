#!/usr/bin/env bash
# Start ship.sh detached so it survives the shell/session that started it.
# Linux operators get a transient user systemd unit; Git Bash on Windows falls back to nohup.
set -euo pipefail
source "$(dirname -- "${BASH_SOURCE[0]}")/release-env.sh"
[[ -n "${1:-}" ]] || { echo 'usage: ship-bg.sh <lds-vX.Y.Z existing immutable tag>' >&2; exit 2; }
log="${LDS_RELEASE_LOG_DIR}/ship-$1-$(date +%Y%m%dT%H%M%S).log"
if command -v systemd-run >/dev/null 2>&1; then
  systemctl --user reset-failed lds-release-ship.service >/dev/null 2>&1 || true
  systemd-run --user --unit lds-release-ship --collect --quiet \
    -p "StandardOutput=file:${log}" -p StandardError=inherit \
    --setenv=PATH="${PATH}" --setenv=HOME="${HOME}" --setenv=SSH_AUTH_SOCK="${SSH_AUTH_SOCK:-}" \
    --setenv=LDS_RELEASE_ENV="${LDS_RELEASE_ENV}" \
    "${RELEASE_DIR}/ship.sh" "$1"
  echo "status: systemctl --user status lds-release-ship"
else
  nohup "${RELEASE_DIR}/ship.sh" "$1" > "${log}" 2>&1 < /dev/null &
  echo "pid: $!"
fi
echo "ship started: ${log}"
echo "follow: tail -f ${log}"
