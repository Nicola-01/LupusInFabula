#!/bin/sh
# Replaces the hard-coded dev password of lupus_sql (set in 01_database_tables.sql) with DB_PASSWORD.
set -eu
# via stdin: psql does not interpolate :'var' in -c
echo "ALTER ROLE lupus_sql PASSWORD :'pw';" | psql -v ON_ERROR_STOP=1 -v pw="$DB_PASSWORD" -U "$POSTGRES_USER" -d "$POSTGRES_DB"
