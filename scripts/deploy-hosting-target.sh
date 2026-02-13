#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

# shellcheck source=./scripts/lib/node20.sh
. "$ROOT_DIR/scripts/lib/node20.sh"

TARGET="${1:-}"
if [ -z "$TARGET" ]; then
  echo "[deploy] ERROR: missing target (development|production)" >&2
  echo "[deploy] Usage: scripts/deploy-hosting-target.sh development" >&2
  exit 1
fi

case "$TARGET" in
  development|production) ;;
  *)
    echo "[deploy] ERROR: invalid target '$TARGET' (expected development|production)" >&2
    exit 1
    ;;
esac

PROJECT_ID="${FIREBASE_PROJECT_ID:-staituned-production-163f4}"
FIREBASE_CONFIG_FILE="firebase.json"

if [ "$TARGET" = "development" ]; then
  FIREBASE_CONFIG_FILE="firebase.development.json"
fi

echo "[deploy] repo:   $ROOT_DIR"
echo "[deploy] target: $TARGET"
echo "[deploy] project: $PROJECT_ID"
echo "[deploy] config: $FIREBASE_CONFIG_FILE"

ensure_node_22_plus

# Keep deploy behavior aligned with production stability constraints.
export CI=1
export npm_config_update_notifier=false
export npm_config_fund=false
export npm_config_audit=false

if [ "${SKIP_INSTALL:-0}" != "1" ]; then
  echo ""
  echo "[deploy] === install (npm ci) ==="
  npm ci
else
  echo "[deploy] SKIP_INSTALL=1 (skipping npm ci)"
fi

if [ "${SKIP_BUILD:-0}" != "1" ]; then
  echo ""
  echo "[deploy] === typecheck (tsc) ==="
  npm run typecheck

  echo ""
  echo "[deploy] === build (Next, Turbopack) ==="
  npm run build
else
  echo "[deploy] SKIP_BUILD=1 (skipping build)"
fi

echo ""
echo "[deploy] === deploy (firebase hosting) ==="
firebase deploy --only hosting --project "$PROJECT_ID" --config "$FIREBASE_CONFIG_FILE"
