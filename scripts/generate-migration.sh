#!/usr/bin/env bash
name="unnamed-migration"
echo "Enter name for migration file(unnamed-migration):"
read -p name
sequelize migration:create --name $name --migrations-path src/data/migrations --config src/core/db-config.json