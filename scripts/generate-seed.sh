#!/usr/bin/env bash
name="unnamed-seed"
read -p "Enter name for seed file(unnamed-seed):" name
sequelize seed:create --name $name --config ${CONFIG} --seeders-path ${SEEDERS_PATH}