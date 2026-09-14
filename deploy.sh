#!/usr/bin/env bash
# Publish a built briefing to https://tmp.nitida.pt/<file> and send the link to Nuno on Telegram.
#   ./deploy.sh output/<trip>.html
# Runs from the laptop only: it needs the jaws key, and echo deliberately has none
# (decision 2026-09-13). Telegram: token read at runtime from ~/.openclaw/openclaw.json when
# present; otherwise the link is only printed. No model involved anywhere here.
set -euo pipefail
[ $# -eq 1 ] && [ -f "$1" ] || { echo "Usage: ./deploy.sh output/<trip>.html"; exit 1; }
f=$1; name=$(basename "$f")
scp -q "$f" nuno@jaws:/var/www/tmp/ && url="https://tmp.nitida.pt/$name"
echo "$url"
tok=${TELEGRAM_BOT_TOKEN:-$(jq -r '.channels.telegram.botToken // empty' "$HOME/.openclaw/openclaw.json" 2>/dev/null || true)}
if [ -n "$tok" ]; then
  curl -s -m 15 -X POST "https://api.telegram.org/bot$tok/sendMessage" -d chat_id="${TELEGRAM_CHAT_ID:-1650394050}" \
    --data-urlencode text="📘 Briefing publicado: $url ($(hostname), $(date +%d/%m\ %H:%M))" >/dev/null && echo "link sent to Nuno on Telegram"
fi
