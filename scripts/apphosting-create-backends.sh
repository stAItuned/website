#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

PROJECT_ID="${FIREBASE_PROJECT_ID:-staituned-production-163f4}"
PRIMARY_REGION="${APPHOSTING_REGION:-europe-west4}"
ROOT_DIR_ARG="${APPHOSTING_ROOT_DIR:-.}"

TEST_BACKEND_ID="${APPHOSTING_TEST_BACKEND_ID:-staituned-test}"
PROD_BACKEND_ID="${APPHOSTING_PROD_BACKEND_ID:-staituned-prod}"

WEB_APP_ID_ARG="${APPHOSTING_WEB_APP_ID:-}"

echo "[apphosting] project: $PROJECT_ID"
echo "[apphosting] region:  $PRIMARY_REGION"
echo "[apphosting] rootDir: $ROOT_DIR_ARG"
echo "[apphosting] test backend: $TEST_BACKEND_ID"
echo "[apphosting] prod backend: $PROD_BACKEND_ID"

CREATE_TEST_ARGS=(
  apphosting:backends:create
  --project "$PROJECT_ID"
  --backend "$TEST_BACKEND_ID"
  --primary-region "$PRIMARY_REGION"
  --root-dir "$ROOT_DIR_ARG"
)

CREATE_PROD_ARGS=(
  apphosting:backends:create
  --project "$PROJECT_ID"
  --backend "$PROD_BACKEND_ID"
  --primary-region "$PRIMARY_REGION"
  --root-dir "$ROOT_DIR_ARG"
)

if [ -n "$WEB_APP_ID_ARG" ]; then
  CREATE_TEST_ARGS+=(--app "$WEB_APP_ID_ARG")
  CREATE_PROD_ARGS+=(--app "$WEB_APP_ID_ARG")
fi

echo ""
echo "[apphosting] creating TEST backend..."
firebase "${CREATE_TEST_ARGS[@]}"

echo ""
echo "[apphosting] creating PROD backend..."
firebase "${CREATE_PROD_ARGS[@]}"

echo ""
echo "[apphosting] done"
echo "[apphosting] next steps:"
echo "  1) Connect branch 'pre_release' to backend '$TEST_BACKEND_ID' in Firebase Console."
echo "  2) Connect branch 'master' to backend '$PROD_BACKEND_ID' in Firebase Console."
echo "  3) Set secrets with: npm run apphosting:secrets:set -- <SECRET_NAME>"
