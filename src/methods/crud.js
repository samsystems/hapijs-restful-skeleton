const internals = module.exports = {};
const EntityNotFoundException = require('../core/error/notfound-exception');
const queryHelper = require('../core/helpers/querys');
const _ = require('lodash');

internals.list = {
    method: (entity, query = null, relatedEntities = null) => {
        let opts = queryHelper.getSequilizeQueryOpts(query, relatedEntities);
        return entity.findAndCountAll(opts);
    },
    options: {}
};

internals.findOne = {
    method: (entity, id, relatedEntities) => {
        return entity.findById(id, {include: relatedEntities}).then((data) => {
            if (!data)
                throw new EntityNotFoundException(entity.name + ' resource not found');
            return data;
        });
    },
    options: {}
};

internals.create = {
    method: (entity, data, relatedEntities = null) => {

        if (_.isArray(data)) {
            return entity.bulkCreate(data);
        } else {
            if(relatedEntities) {
                return entity.build(data, {include: relatedEntities}).save();
            }
            return entity.build(data).save();
        }
    },
    options: {}
};

internals.update = {
    method: (entity, id, data) => {

        return entity.findById(id)
            .then((user) => {
                if (!user)
                    throw new EntityNotFoundException(entity.name + ' resource not found');

                _.forEach(data, (value, field) => {
                    user[field] = value;
                });
                if (_.keys(user._changed).length)
                    return user.save();
                else
                    return user;
            });
    }
};

internals.delete = {
    method: (entity, id) => {

        return entity.findById(id)
            .then((user) => {
                if (!user)
                    throw new EntityNotFoundException(entity.name + ' resource not found');
                return user.destroy();
            });
    }
};