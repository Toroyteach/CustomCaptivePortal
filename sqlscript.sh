#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

# CONFIG
SRC_DB="radius_2"
DEST_DB="radius_3"
MYSQL_USER="root"
MYSQL_PASS="your_secure_password" # Replace or prompt securely

# SECURE TEMP DIR
TMP_DIR=$(mktemp -d)
STRUCTURE_ONLY_SQL="$TMP_DIR/structure_only.sql"
USERS_FULL_SQL="$TMP_DIR/users_full.sql"

# GET TABLE LIST EXCEPT 'users'
TABLES=$(mysql -u "$MYSQL_USER" -p"$MYSQL_PASS" -N -e \
  "SELECT table_name FROM information_schema.tables WHERE table_schema = '$SRC_DB' AND table_name != 'users';")

# DUMP STRUCTURE ONLY FOR ALL EXCEPT 'users'
mysqldump -u "$MYSQL_USER" -p"$MYSQL_PASS" --no-data "$SRC_DB" $TABLES >"$STRUCTURE_ONLY_SQL"

# DUMP STRUCTURE + DATA FOR 'users'
mysqldump -u "$MYSQL_USER" -p"$MYSQL_PASS" "$SRC_DB" users >"$USERS_FULL_SQL"

# CREATE DESTINATION DATABASE IF NOT EXISTS
mysql -u "$MYSQL_USER" -p"$MYSQL_PASS" -e "CREATE DATABASE IF NOT EXISTS \`$DEST_DB\`;"

# IMPORT INTO DESTINATION DB
mysql -u "$MYSQL_USER" -p"$MYSQL_PASS" "$DEST_DB" <"$STRUCTURE_ONLY_SQL"
mysql -u "$MYSQL_USER" -p"$MYSQL_PASS" "$DEST_DB" <"$USERS_FULL_SQL"

# CLEANUP
rm -rf "$TMP_DIR"
