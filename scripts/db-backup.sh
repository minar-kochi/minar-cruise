#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/db-backup.sh "<DATABASE_URL>"
# Writes:
#   backup/<YYYY-MM-DD_HH-MM-SS>/db.dump   (pg_dump custom format, restore with pg_restore)
#   backup/<YYYY-MM-DD_HH-MM-SS>/db.sql    (pg_dump plain SQL)
#   backup/<YYYY-MM-DD_HH-MM-SS>/meta.txt  (host/db/user, pg_dump version, file sizes)

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <DATABASE_URL>" >&2
  exit 1
fi

DB_URL="$1"
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TS="$(date +%Y-%m-%d_%H-%M-%S)"
OUT_DIR="$ROOT_DIR/backup/$TS"

mkdir -p "$OUT_DIR"

# Parse URL parts without exposing the password.
# Strip scheme.
url_no_scheme="${DB_URL#*://}"
# Strip credentials (everything before the last '@' before the first '/').
hostpath="${url_no_scheme#*@}"
creds="${url_no_scheme%@*}"
user="${creds%%:*}"
host_port="${hostpath%%/*}"
host="${host_port%%:*}"
port="${host_port#*:}"
[[ "$port" == "$host_port" ]] && port="5432"
db_and_query="${hostpath#*/}"
db="${db_and_query%%\?*}"

echo "==> Backup target: $OUT_DIR"
echo "==> Host: $host  Port: $port  DB: $db  User: $user"

echo "==> Writing db.dump (custom format)..."
pg_dump --format=custom --no-owner --no-privileges \
  --file="$OUT_DIR/db.dump" "$DB_URL"

echo "==> Writing db.sql (plain SQL)..."
pg_dump --format=plain --no-owner --no-privileges \
  --file="$OUT_DIR/db.sql" "$DB_URL"

echo "==> Writing meta.txt..."
{
  echo "Timestamp: $TS"
  echo "pg_dump:   $(pg_dump --version)"
  echo "Host:      $host"
  echo "Port:      $port"
  echo "Database:  $db"
  echo "User:      $user"
  echo ""
  echo "Files:"
  ls -lh "$OUT_DIR" | awk 'NR>1 {printf "  %-12s %s\n", $9, $5}'
} > "$OUT_DIR/meta.txt"

echo "==> Done. $OUT_DIR"
