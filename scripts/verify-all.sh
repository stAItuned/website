#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "[verify] repo: $ROOT_DIR"

# shellcheck source=./scripts/lib/node20.sh
. "$ROOT_DIR/scripts/lib/node20.sh"

run_step() {
  local name="$1"
  shift
  echo ""
  echo "[verify] === $name ==="
  "$@"
}

has_broken_bin_links() {
  if [ ! -d "node_modules/.bin" ]; then
    return 1
  fi

  # broken symlink = exists as link but target missing
  if find node_modules/.bin -type l ! -exec test -e {} \; -print -quit 2>/dev/null | grep -q .; then
    return 0
  fi

  return 1
}

repair_node_modules_if_needed() {
  if [ ! -d "node_modules" ]; then
    return 0
  fi

  if has_broken_bin_links; then
    echo "[verify] Detected corrupted node_modules (broken .bin symlinks); removing node_modules..." >&2
    rm -rf node_modules
  fi
}

npm_ci_compatible() {
  repair_node_modules_if_needed

  if npm ci; then
    return 0
  fi

  echo "[verify] npm ci failed; retrying after clearing local npm cache..." >&2
  rm -rf "${npm_config_cache:-$ROOT_DIR/.npm-cache}"
  rm -rf node_modules
  if npm ci; then
    return 0
  fi

  echo "[verify] npm ci failed; attempting to re-sync lockfile via npm install" >&2
  rm -rf node_modules
  npm install
}

ensure_node_22_plus

export NEXT_PRIVATE_TURBOPACK=true
export CI=1
export npm_config_cache="$ROOT_DIR/.npm-cache"
export npm_config_update_notifier=false
export npm_config_fund=false
export npm_config_audit=false

if [ "${SKIP_INSTALL:-0}" != "1" ]; then
  run_step "install (npm ci)" npm_ci_compatible
else
  echo "[verify] SKIP_INSTALL=1 (skipping npm ci)"
fi

if [ "${SKIP_TYPECHECK:-0}" != "1" ]; then
  if [ -x "./node_modules/.bin/tsc" ]; then
    run_step "typecheck (tsc --noEmit)" ./node_modules/.bin/tsc -p tsconfig.json --noEmit
  else
    echo "[verify] WARN: tsc not found; skipping typecheck"
  fi
else
  echo "[verify] SKIP_TYPECHECK=1 (skipping typecheck)"
fi

if [ "${SKIP_LINT:-0}" != "1" ]; then
  if [ -x "./node_modules/.bin/eslint" ]; then
    run_step "lint (eslint)" ./node_modules/.bin/eslint .
  else
    echo "[verify] WARN: eslint not found; skipping lint"
  fi
else
  echo "[verify] SKIP_LINT=1 (skipping lint)"
fi

if [ "${SKIP_TEST:-0}" != "1" ]; then
  run_step "test (vitest --run)" npm test -- --run
else
  echo "[verify] SKIP_TEST=1 (skipping tests)"
fi

if [ "${SKIP_BUILD:-0}" != "1" ]; then
  run_step "build (Next, Turbopack)" npm run build
else
  echo "[verify] SKIP_BUILD=1 (skipping build)"
fi

if [ "${SMOKE:-0}" = "1" ]; then
  run_step "smoke (start + curl)" bash -lc '
    set -euo pipefail
    PORT="${PORT:-3000}"
    npm run start -- --port "$PORT" >/tmp/next-start.log 2>&1 &
    pid="$!"
    cleanup() { kill "$pid" >/dev/null 2>&1 || true; }
    trap cleanup EXIT

    for _ in $(seq 1 40); do
      if curl -fsS "http://127.0.0.1:${PORT}/" >/dev/null; then
        echo "[verify] smoke OK: /"
        exit 0
      fi
      sleep 0.5
    done

    echo "[verify] smoke FAILED: server did not respond; see /tmp/next-start.log" >&2
    exit 1
  '
fi

if [ -n "${DEPLOY_TARGET:-}" ]; then
  if [ "${CONFIRM_DEPLOY:-0}" != "1" ]; then
    echo "[verify] Refusing to deploy without CONFIRM_DEPLOY=1 (DEPLOY_TARGET=$DEPLOY_TARGET)" >&2
    exit 1
  fi

  case "$DEPLOY_TARGET" in
    test) run_step "deploy (firebase hosting:development)" npm run deploy:test ;;
    prod) run_step "deploy (firebase hosting:production)" npm run deploy:prod ;;
    *)
      echo "[verify] ERROR: DEPLOY_TARGET must be 'test' or 'prod'" >&2
      exit 1
      ;;
  esac
fi

echo ""
echo "[verify] ✅ all done"
