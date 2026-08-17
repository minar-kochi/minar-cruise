#!/usr/bin/env bash
#
# Builds the `minar_test` database the integration suite runs against.
#
#   ./tests/setup-test-db.sh            # create if absent, then sync schema
#   ./tests/setup-test-db.sh --reset    # drop it first
#
# Runs from the HOST (it needs both containers), not from inside minar-dev.
# `make test-db-setup` is the intended entry point.
#
# Why `prisma migrate diff` and not `prisma db push`: the Prisma CLI loads
# minar-cruise/.env and that beats an inline DATABASE_URL, so
# `DATABASE_URL=<test> npx prisma db push` would quietly rebuild the DEV
# database instead. `migrate diff --from-empty` never connects anywhere, and the
# SQL is piped into a psql session that is explicitly aimed at minar_test.
set -euo pipefail

DB_NAME="${TEST_DB_NAME:-minar_test}"
DB_USER="${TEST_DB_USER:-myuser}"
PG_CONTAINER="${PG_CONTAINER:-minar-postgres}"
DEV_CONTAINER="${DEV_CONTAINER:-minar-dev}"
REPO_DIR="/workspace/minar-cruise"

case "${DB_NAME}" in
  *_test) ;;
  *) echo "refusing: TEST_DB_NAME=${DB_NAME} does not end in _test" >&2; exit 1 ;;
esac

psql_db() { docker exec -i "$PG_CONTAINER" psql -v ON_ERROR_STOP=1 -U "$DB_USER" -d "$DB_NAME" "$@"; }
psql_adm() { docker exec -i "$PG_CONTAINER" psql -v ON_ERROR_STOP=1 -U "$DB_USER" -d postgres "$@"; }

if [ "${1:-}" = "--reset" ]; then
  echo ">>> dropping ${DB_NAME}"
  psql_adm -c "DROP DATABASE IF EXISTS \"${DB_NAME}\" WITH (FORCE)" >/dev/null
fi

exists=$(psql_adm -tAc "SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'")
if [ "$exists" != "1" ]; then
  echo ">>> creating ${DB_NAME}"
  psql_adm -c "CREATE DATABASE \"${DB_NAME}\"" >/dev/null
else
  echo ">>> ${DB_NAME} already exists"
fi

echo ">>> generating schema SQL from prisma/schema.prisma"
schema_sql=$(docker exec --user node -w "$REPO_DIR" "$DEV_CONTAINER" \
  npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script)

if [ -z "$schema_sql" ]; then
  echo "prisma migrate diff produced nothing" >&2
  exit 1
fi

echo ">>> applying schema to ${DB_NAME}"
# Idempotent across re-runs: a second pass finds every table already there.
printf '%s\n' "$schema_sql" | psql_db >/dev/null 2>&1 || \
  echo "    (schema already present — continuing)"

# `db push` from schema.prisma alone does NOT create these. They are the point of
# the whole UTC-instants migration: Schedule_day_matches_startsAt is what makes a
# row whose rendered date disagrees with its booked date impossible to store.
# The file is written with DROP CONSTRAINT IF EXISTS / DROP COLUMN IF EXISTS
# throughout, so it is safe on a fresh database and safe to re-run.
echo ">>> applying prisma/sql/2026-08-tz/004_contract.sql (CHECK constraints)"
docker exec -i "$PG_CONTAINER" psql -v ON_ERROR_STOP=1 -U "$DB_USER" -d "$DB_NAME" \
  < "$(dirname "$0")/../prisma/sql/2026-08-tz/004_contract.sql" >/dev/null

# regclass renders these quoted ("Package"), hence relname rather than a cast.
echo ">>> constraints in place:"
psql_db -tAc "
  SELECT '    ' || c.relname || '.' || con.conname
  FROM pg_constraint con
  JOIN pg_class c ON c.oid = con.conrelid
  WHERE con.contype = 'c' AND c.relname IN ('Package', 'Schedule', 'BookingLink')
  ORDER BY 1"

count=$(psql_db -tAc "
  SELECT count(*) FROM pg_constraint con
  JOIN pg_class c ON c.oid = con.conrelid
  WHERE con.contype = 'c' AND c.relname IN ('Package', 'Schedule', 'BookingLink')")
if [ "$count" -lt 6 ]; then
  echo "expected 6 CHECK constraints, found ${count}" >&2
  exit 1
fi

echo ">>> ${DB_NAME} ready"
