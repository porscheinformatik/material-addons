#!/usr/bin/env bash
set -euo pipefail
branch="$1"
target="$2"
tmp_dir="$(mktemp -d)"
trap 'rm -rf "$tmp_dir"' EXIT

git worktree add "$tmp_dir" "$branch"
cd "$tmp_dir"
rm -rf dist/material-addons dist/material-addons-project
npm ci
npm run build:mat-add
npm run build:demo
cp -R dist/material-addons-project "$GITHUB_WORKSPACE/dist/material-addons-project-$target"
