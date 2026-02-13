#!/usr/bin/env bash
set -euo pipefail

maybe_load_nvm() {
  # Homebrew/npm global prefix can break `nvm use` in non-interactive shells.
  unset npm_config_prefix || true
  unset NPM_CONFIG_PREFIX || true

  if command -v nvm >/dev/null 2>&1; then
    return 0
  fi

  local nvm_dir="${NVM_DIR:-$HOME/.nvm}"
  if [ -s "$nvm_dir/nvm.sh" ]; then
    # shellcheck disable=SC1090
    . "$nvm_dir/nvm.sh"
    return 0
  fi

  return 1
}

use_node_from_nvmrc() {
  if [ ! -f ".nvmrc" ]; then
    return 0
  fi

  if maybe_load_nvm; then
    nvm use >/dev/null 2>&1 || true
  fi
}

try_prefer_node22_path() {
  # Fallback when `nvm` isn't available in non-interactive shells.
  # Prefers the newest installed v22.x under the default NVM directory.
  local nvm_dir="${NVM_DIR:-$HOME/.nvm}"
  local node_bin_dir=""

  if [ -n "${NODE22_BIN:-}" ] && [ -x "${NODE22_BIN:-}" ]; then
    node_bin_dir="$(cd "$(dirname "$NODE22_BIN")" && pwd)"
    export PATH="$node_bin_dir:$PATH"
    hash -r 2>/dev/null || true
    echo "[node] using NODE22_BIN=$NODE22_BIN"
    return 0
  fi

  node_bin_dir="$(ls -d "$nvm_dir"/versions/node/v22.*.*/bin 2>/dev/null | sort -V | tail -n 1 || true)"
  if [ -n "$node_bin_dir" ] && [ -x "$node_bin_dir/node" ]; then
    export PATH="$node_bin_dir:$PATH"
    hash -r 2>/dev/null || true
    echo "[node] using Node from $node_bin_dir"
    return 0
  fi

  return 1
}

ensure_node_22_plus() {
  # Prefer .nvmrc when available to keep deploy behavior deterministic.
  use_node_from_nvmrc || true

  local v
  v="$(node -p "process.versions.node" 2>/dev/null || true)"
  if [ -z "$v" ]; then
    echo "[node] ERROR: node is not available in PATH" >&2
    exit 1
  fi

  local major minor patch
  IFS='.' read -r major minor patch <<<"$v"

  if [[ ! "$major" =~ ^[0-9]+$ || ! "$minor" =~ ^[0-9]+$ ]]; then
    echo "[node] ERROR: unexpected node version: $v" >&2
    exit 1
  fi

  local is_supported_major=0
  if [ "$major" -ge 22 ] && [ "$major" -lt 26 ]; then
    is_supported_major=1
  fi

  if [ "$is_supported_major" -ne 1 ]; then
    echo "[node] Node $v detected; trying to switch to a supported Node (>=22 <26)..." >&2

    use_node_from_nvmrc || true
    try_prefer_node22_path || true

    v="$(node -p "process.versions.node" 2>/dev/null || true)"
    IFS='.' read -r major minor patch <<<"$v"
    is_supported_major=0
    if [ "$major" -ge 22 ] && [ "$major" -lt 26 ]; then
      is_supported_major=1
    fi

    if [ "$is_supported_major" -ne 1 ]; then
      echo "[node] ERROR: Node $v detected; require Node >=22 and <26." >&2
      echo "[node] Fix: run 'nvm use 22' (or another supported major) or set NODE22_BIN to a Node 22+ binary." >&2
      exit 1
    fi
  fi

  echo "[node] node: v$(node -p "process.versions.node")"
  echo "[node] npm:  v$(npm -v)"
  echo "[node] npm-bin: $(command -v npm)"
}

ensure_node_20_9_plus() {
  ensure_node_22_plus
}
