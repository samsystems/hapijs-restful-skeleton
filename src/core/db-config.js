module.exports = {
    "development": {
        "username": process.env.DB_USER,
        "password": process.env.DB_PASSWORD,
        "database": process.env.DB_NAME,
        "host": process.env.DB_HOSTNAME,
        "dialect": process.env.DB_DIALECT
    },
    "test": {
        "username": process.env.DB_USER,
        "password": process.env.DB_PASSWORD,
        "database": process.env.DB_NAME,
        "host": process.env.DB_TEST_HOSTNAME,
        "dialect": process.env.DB_DIALECT
    },
    "production": {
        "username": process.env.DB_USER,
        "password": process.env.DB_PASSWORD,
        "database": process.env.DB_NAME,
        "host": process.env.DB_PROD_HOSTNAME,
        "dialect": process.env.DB_DIALECT
    }
};
