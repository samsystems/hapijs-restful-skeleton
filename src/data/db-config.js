const path = require('path');

module.exports = {
    'env': process.env.NODE_ENV,
    'config': path.resolve('./src/core', 'db-config.json'),
    'migrations-path': path.resolve('src/data', 'migrations'),
    'models-path': path.resolve('./src', 'models'),
    'seeders-path': path.resolve('./src/data', 'seeders')
}
