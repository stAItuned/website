#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

PROJECT_ID="${FIREBASE_PROJECT_ID:-staituned-production-163f4}"
ENV_FILE="${1:-.env}"

if [ ! -f "$ENV_FILE" ]; then
  echo "[check] ERROR: env file not found: $ENV_FILE" >&2
  exit 1
fi

tmp_required="$(mktemp)"
trap 'rm -f "$tmp_required"' EXIT

awk '/secret:/ {print $2}' apphosting.yaml apphosting.test.yaml apphosting.prod.yaml | sort -u > "$tmp_required"

echo "[check] project: $PROJECT_ID"
echo "[check] env file: $ENV_FILE"
echo
echo "[check] Required secrets from apphosting*.yaml:"
cat "$tmp_required"
echo

echo "[check] Env coverage:"
missing_env=0
while read -r secret; do
  if awk -F= -v k="$secret" '$1==k{f=1} END{exit(!f)}' "$ENV_FILE"; then
    echo "  ENV_OK: $secret"
  else
    echo "  ENV_MISSING: $secret"
    missing_env=1
  fi
done < "$tmp_required"
echo

echo "[check] Cloud existence/access (firebase apphosting:secrets:describe):"
cloud_unknown=0
while read -r secret; do
  if firebase apphosting:secrets:describe "$secret" --project "$PROJECT_ID" >/dev/null 2>&1; then
    echo "  CLOUD_OK: $secret"
  else
    echo "  CLOUD_MISSING_OR_NOACCESS: $secret"
    cloud_unknown=1
  fi
done < "$tmp_required"
echo

if [ "$missing_env" -ne 0 ]; then
  echo "[check] Result: Some required secrets are missing in $ENV_FILE."
else
  echo "[check] Result: All required secrets are present in $ENV_FILE."
fi

if [ "$cloud_unknown" -ne 0 ]; then
  echo "[check] Note: Some cloud checks failed (secret missing or CLI/project permissions issue)."
fi
