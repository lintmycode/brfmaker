#!/usr/bin/env bash
# Publish a built briefing to https://tmp.nitida.pt/<file> and send the link to Nuno on Telegram.
#   ./deploy.sh output/<trip>.html
# From the laptop this is a plain scp (full key). From echo the key on jaws is restricted
# (authorized_keys: command=~/bin/brf-receive,restrict — approved by Nuno 2026-09-14): it can
# only run that receiver, which accepts "put <name>.html" on stdin, so the file is piped.
# Telegram: token read at runtime from ~/.openclaw/openclaw.json when present (echo);
# otherwise the link is only printed. No model involved anywhere here.
set -euo pipefail
[ $# -eq 1 ] && [ -f "$1" ] || { echo "Usage: ./deploy.sh output/<trip>.html"; exit 1; }
f=$1; name=$(basename "$f"); url=""
mode=${BRF_DEPLOY_VIA:-scp}; [ "$(hostname)" = echo ] && mode=${BRF_DEPLOY_VIA:-pipe}
if [ "$mode" = pipe ]; then
  url=$(ssh -o BatchMode=yes jaws "put $name" < "$f")
else
  scp -q "$f" nuno@jaws:/var/www/tmp/ && url="https://tmp.nitida.pt/$name"
fi
[ -n "$url" ] || { echo "deploy failed"; exit 1; }
echo "$url"
tok=${TELEGRAM_BOT_TOKEN:-$(jq -r '.channels.telegram.botToken // empty' "$HOME/.openclaw/openclaw.json" 2>/dev/null || true)}
if [ -n "$tok" ]; then
  curl -s -m 15 -X POST "https://api.telegram.org/bot$tok/sendMessage" -d chat_id="${TELEGRAM_CHAT_ID:-1650394050}" \
    --data-urlencode text="📘 Briefing publicado: $url ($(hostname), $(date +%d/%m\ %H:%M))" >/dev/null && echo "link sent to Nuno on Telegram"
fi
