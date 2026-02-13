#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

SECRET_NAME="${1:-}"
if [ -z "$SECRET_NAME" ]; then
  echo "[apphosting] ERROR: missing secret name" >&2
  echo "[apphosting] Usage: scripts/apphosting-secrets-set.sh SECRET_NAME [value]" >&2
  exit 1
fi

PROJECT_ID="${FIREBASE_PROJECT_ID:-staituned-production-163f4}"
VALUE="${2:-}"

if [ -n "$VALUE" ]; then
  printf "%s" "$VALUE" | firebase apphosting:secrets:set "$SECRET_NAME" \
    --project "$PROJECT_ID" \
    --data-file -
  exit 0
fi

firebase apphosting:secrets:set "$SECRET_NAME" --project "$PROJECT_ID"

