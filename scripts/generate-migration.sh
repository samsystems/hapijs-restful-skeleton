#!/usr/bin/env bash
name="unnamed-migration"
read -p "Enter name for migration file(unnamed-migration):" name
sequelize migration:create --name $name --migrations-path ${MIGRATIONS_PATH}