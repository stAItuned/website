#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

TARGET="${1:-}"
if [ -z "$TARGET" ]; then
  echo "[apphosting] ERROR: missing target (test|prod)" >&2
  echo "[apphosting] Usage: scripts/apphosting-rollout.sh test" >&2
  exit 1
fi

PROJECT_ID="${FIREBASE_PROJECT_ID:-staituned-production-163f4}"
TEST_BACKEND_ID="${APPHOSTING_TEST_BACKEND_ID:-staituned-test}"
PROD_BACKEND_ID="${APPHOSTING_PROD_BACKEND_ID:-staituned-prod}"

case "$TARGET" in
  test)
    BACKEND_ID="$TEST_BACKEND_ID"
    GIT_BRANCH="pre_release"
    ;;
  prod)
    BACKEND_ID="$PROD_BACKEND_ID"
    GIT_BRANCH="master"
    ;;
  *)
    echo "[apphosting] ERROR: invalid target '$TARGET' (expected test|prod)" >&2
    exit 1
    ;;
esac

echo "[apphosting] project: $PROJECT_ID"
echo "[apphosting] target: $TARGET"
echo "[apphosting] backend: $BACKEND_ID"
echo "[apphosting] branch: $GIT_BRANCH"

firebase apphosting:rollouts:create "$BACKEND_ID" \
  --project "$PROJECT_ID" \
  --git-branch "$GIT_BRANCH"

