#!/usr/bin/sh
URL=${DB_DIALECT}://${DB_USER}:${DB_PASSWORD}@${DB_HOSTNAME}/${DB_NAME}

sequelize db:migrate --url ${URL} --migrations-path ${MIGRATIONS_PATH}
exit;