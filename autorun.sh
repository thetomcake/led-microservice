#!/bin/bash
set -e

UPDATE_CHECK_DELAY=${1:-60}
PID=""
CURRENT_DIR=$(dirname "${BASH_SOURCE[0]}")
cd "$CURRENT_DIR"
echo "Checking for updates every $UPDATE_CHECK_DELAY seconds"
echo "Starting..."

while true; do
  git fetch
  GIT_REMOTE_BRANCH="origin/$(git rev-parse --abbrev-ref HEAD)"
  CURRENT=$(git log -1 --pretty=format:"%h")
  ORIGIN=$(git log -1 --pretty=format:"%h" "$GIT_REMOTE_BRANCH")

  if [ "$CURRENT" == "$ORIGIN" ] && [ "$PID" != "" ]; then
      sleep "$UPDATE_CHECK_DELAY"
  else
    if [ "$PID" != "" ]; then
      kill "$PID"
    fi
    git reset --hard
    git clean -df
    git pull
    npm ci
    node index.js &
    PID=$!
  fi

done