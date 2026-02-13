#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

PROJECT_ID="${FIREBASE_PROJECT_ID:-staituned-production-163f4}"
MODE="${1:-core}"

CORE_SECRETS=(
  "RESEND_API_KEY"
  "FB_SERVICE_ACCOUNT_KEY_B64"
  "GOOGLE_AI_API_KEY"
  "PERPLEXITY_API_KEY"
  "PREVIEW_SECRET"
)

ALL_SECRETS=(
  "RESEND_API_KEY"
  "FB_SERVICE_ACCOUNT_KEY_B64"
  "FB_SERVICE_ACCOUNT_KEY"
  "GOOGLE_ANALYTICS_PRIVATE_KEY"
  "GOOGLE_ANALYTICS_CLIENT_EMAIL"
  "GOOGLE_ANALYTICS_PROJECT_ID"
  "GOOGLE_AI_API_KEY"
  "PERPLEXITY_API_KEY"
  "PREVIEW_SECRET"
  "GA_API_SECRET"
  "SLACK_WEBHOOK_FEEDBACK"
  "WEBSITE_DISPATCH_TOKEN"
  "TELEGRAM_BOT_TOKEN"
  "TELEGRAM_CHAT_ID"
  "CRON_SECRET"
  "CAREER_OS_CALENDLY_URL"
  "NEXT_PUBLIC_CAREER_OS_CALENDLY_URL"
  "NEXT_PUBLIC_ENABLE_FEEDBACK"
  "ANALYTICS_MAX_DAILY_CALLS"
  "ANALYTICS_CACHE_DURATION"
  "ANALYTICS_CLIENT_CACHE_DURATION"
  "ENABLE_ANALYTICS_API"
  "ANALYTICS_VERBOSE_LOGGING"
  "FORCE_ANALYTICS_MOCK"
)

case "$MODE" in
  core)
    SECRETS=("${CORE_SECRETS[@]}")
    ;;
  all)
    SECRETS=("${ALL_SECRETS[@]}")
    ;;
  *)
    echo "[apphosting] ERROR: invalid mode '$MODE' (expected core|all)" >&2
    exit 1
    ;;
esac

echo "[apphosting] project: $PROJECT_ID"
echo "[apphosting] mode: $MODE"

for name in "${SECRETS[@]}"; do
  value="${!name-}"
  if [ -z "$value" ]; then
    echo "[apphosting] skip: $name (missing in current shell env)"
    continue
  fi

  echo "[apphosting] set: $name"
  printf "%s" "$value" | firebase apphosting:secrets:set "$name" \
    --project "$PROJECT_ID" \
    --data-file -
done

echo "[apphosting] done"
