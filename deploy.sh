#!/usr/bin/env bash
# Publish a briefing set to https://tmp.nitida.pt/<trip>.html and send the link to Nuno on Telegram.
#   ./deploy.sh output/<trip>.html      (or just the trip name: ./deploy.sh puglia)
# Guarantees the published file is a current build: pulls main, rebuilds output/<trip>.html from
# input/<trip>/, and if that changed what is committed, commits + pushes the rebuilt output first.
# Upload: plain scp from the laptop (full key); from echo the key on jaws is restricted to a forced
# command (~/bin/brf-receive, approved 2026-09-14) that accepts "put <name>.html" on stdin.
# Telegram: token read at runtime from ~/.openclaw/openclaw.json when present (echo). No model.
set -euo pipefail
cd "$(dirname "$0")"
arg=${1:-}; [ -n "$arg" ] || { echo "Usage: ./deploy.sh output/<trip>.html | <trip>"; exit 1; }
trip=$(basename "$arg" .html); in="input/$trip"; out="output/$trip.html"; name="$trip.html"
[ -d "$in" ] || { echo "no input folder $in"; exit 1; }
git pull -q --ff-only origin main
node brfmaker.js -i "$in" -o "$out" | tail -1
if [ -n "$(git status --porcelain -- "$out")" ]; then
  git add "$out" && git commit -q -m "$trip: rebuild output before deploy ($(hostname))" && git push -q origin main && echo "output was stale — rebuilt, committed and pushed"
else
  echo "output already current"
fi
url=""
mode=${BRF_DEPLOY_VIA:-scp}; [ "$(hostname)" = echo ] && mode=${BRF_DEPLOY_VIA:-pipe}
if [ "$mode" = pipe ]; then url=$(ssh -o BatchMode=yes jaws "put $name" < "$out"); else scp -q "$out" nuno@jaws:/var/www/tmp/ && url="https://tmp.nitida.pt/$name"; fi
[ -n "$url" ] || { echo "deploy failed"; exit 1; }
echo "$url"
tok=${TELEGRAM_BOT_TOKEN:-$(jq -r '.channels.telegram.botToken // empty' "$HOME/.openclaw/openclaw.json" 2>/dev/null || true)}
if [ -n "$tok" ]; then
  n=$(ls "$in" | grep -cE '^[0-9]+-.*\.md$')
  curl -s -m 15 -X POST "https://api.telegram.org/bot$tok/sendMessage" -d chat_id="${TELEGRAM_CHAT_ID:-1650394050}" \
    --data-urlencode text="📘 Briefing publicado: $url — $n artigos, build $(git log -1 --format=%h -- "$out") ($(hostname), $(date +%d/%m\ %H:%M))" >/dev/null && echo "link sent to Nuno on Telegram"
fi
