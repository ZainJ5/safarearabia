#!/usr/bin/env bash
#
# Runs ON the production server (piped in over SSH by the GitHub Actions
# workflow .github/workflows/deploy.yml). It redeploys the already-running
# app in place: pull the pushed commit, install deps only if they changed,
# rebuild, and restart the existing pm2 process. It does NOT re-provision
# nginx, the domain, env files, or the database.
#
set -euo pipefail

APP_DIR=/var/www/safarearabia
PM2_NAME=safarearabia
BRANCH=master

cd "$APP_DIR"

BEFORE=$(git rev-parse HEAD)

# Safety net: snapshot any uncommitted working-tree changes before we reset.
# (The old deploy flow used scp, so the server tree can drift from git.)
# Untracked files like .env.local / mysql_dump.json are NOT touched by reset.
if ! git diff --quiet HEAD || ! git diff --cached --quiet HEAD; then
  TS=$(date +%Y%m%d-%H%M%S)
  SNAP="/root/${PM2_NAME}-predeploy-${TS}.patch"
  git diff HEAD > "$SNAP" || true
  echo "↳ Saved uncommitted server changes to ${SNAP} (recoverable with: git apply ${SNAP})"
fi

echo "↳ Fetching origin/${BRANCH}"
git fetch --prune origin "$BRANCH"
git reset --hard "origin/${BRANCH}"
AFTER=$(git rev-parse HEAD)
echo "↳ ${BEFORE:0:8} → ${AFTER:0:8}"

if [ "$BEFORE" = "$AFTER" ]; then
  echo "↳ No new commit (manual redeploy / rebuild)."
fi

# Install dependencies only when the lockfile or manifest actually changed.
if ! git diff --quiet "$BEFORE" "$AFTER" -- package.json package-lock.json; then
  echo "↳ Dependencies changed → npm ci"
  npm ci --no-audit --no-fund
else
  echo "↳ Dependencies unchanged → skipping install"
fi

echo "↳ Building (npm run build)"
# If this fails, set -e aborts here and pm2 is NOT restarted,
# so the currently-running process keeps serving the old build.
npm run build

echo "↳ Restarting pm2 process '${PM2_NAME}'"
pm2 restart "$PM2_NAME" --update-env
pm2 save

echo "✅ Deploy complete @ ${AFTER:0:8}"
