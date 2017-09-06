#!/usr/bin/sh
read -p "Enter the version number": name
sequelize migration:create --name $name --migrations-path ${MIGRATIONS_PATH} --url ${DB_DIALECT}://${DB_USER}:${DB_PASSWORD}@${DB_HOSTNAME}:${DB_PORT}/${DB_NAME}