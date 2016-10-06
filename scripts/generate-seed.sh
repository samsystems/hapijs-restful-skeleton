#!/usr/bin/env bash
name="unnamed-seed"
echo "Enter name for seed file(unnamed-seed):"
read -p name
sequelize seed:create --name $name --config src/core/db-config.json --seeders-path src/data/seeders