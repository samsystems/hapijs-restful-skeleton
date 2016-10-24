const internals = module.exports = {};

internals.logAgent = {
    method: (data) => {

        // simulating save in database and returning saved data plus id
        data.id = '111-1111';

        return data;
    },
    options: {}
};