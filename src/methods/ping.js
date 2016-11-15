/** @module Ping */
const internals = module.exports = {};

/**
 * @api GET /ping
 *
 * @description simulating save in database and returning saved data plus status
 * @param {Object} data Data object
 * @return {Object} Returns data object
 * @function logAgent
 */
internals.logAgent = {
    method: (data) => {

        data.status = 'OK';

        return data;
    },
    options: {}
};