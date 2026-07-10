#!/usr/bin/env bash
set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Usage: ./deploy.sh <file>"
  exit 1
fi

scp "$1" nuno@jaws:/var/www/tmp/

echo "http://tmp.nitida.pt/$(basename "$1")"
