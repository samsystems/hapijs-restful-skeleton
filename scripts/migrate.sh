#!/usr/bin/env bash
DB_HOST=$DB_HOSTNAME

case "$NODE_ENV" in
        test)
            DB_HOST=$DB_TEST_HOSTNAME
            ;;
        production)
            DB_HOST=$DB_PROD_HOSTNAME
            ;;
esac
URL="$DB_DIALECT://$DB_USER:$DB_PASSWORD@$DB_HOST/$DB_NAME"

sequelize db:migrate --url ${URL} --migrations-path ${MIGRATIONS_PATH}
exit;