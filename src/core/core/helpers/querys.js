'use strict';
const _ = require('lodash');
const internals = module.exports = {};

internals.getSequilizeQueryOpts = (filters, relatedEntities) => {
    let limit = _.get(filters, 'page[size]', 25);
    let page = _.get(filters, 'page[number]', 1);
    let opts = {
        offset: limit * (page - 1),
        limit: limit
    };
    let sort = _.get(filters, 'sort', false);
    let fields = _.get(filters, 'fields', false);

    if (sort) {
        let direction = 'ASC';
        if (sort[0] == '-') {
            direction = 'DESC';
            sort = sort.substring(1)
        }
        opts.order = [];
        let sorts = sort.split(',');
        _.each(sorts, (field) => {
            opts.order.push([field, direction])
        });
    }

    if (fields) {
        opts.attributes = fields.split(',');
        opts.attributes.push('id');
    }

    if (relatedEntities && fields == false)
        opts.include = relatedEntities;

    return opts;
};