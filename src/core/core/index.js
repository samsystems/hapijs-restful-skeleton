const Glue = require('glue');
const manifest = require('./manifest');

const composeOptions = {
    relativeTo: `${process.cwd()}/src/plugins`
};

module.exports = Glue.compose.bind(Glue, manifest.get('/'), composeOptions);
