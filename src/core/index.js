const Glue = require('glue');
const manifest = require('./manifest');

const composeOptions = {
    relativeTo: __dirname
};

module.exports = Glue.compose.bind(Glue, manifest.get('/'), composeOptions);
