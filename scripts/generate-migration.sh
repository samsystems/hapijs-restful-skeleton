#!/usr/bin/sh
sequelize migration:create --migrations-path ${MIGRATIONS_PATH} --url ${DB_DIALECT}://${DB_USER}:${DB_PASSWORD}@${DB_HOSTNAME}:${DB_PORT}/${DB_NAME}