const internals = module.exports = {};
const EntityNotFoundException = require('../core/error/notfound-exception');
const queryHelper = require('../core/helpers/querys');
const _ = require('lodash');
const sequelizeError = require('../core/error/sequelize');

internals.list = {
    method: (entity, query = null, relatedEntities = null) => {
        let opts = queryHelper.getSequilizeQueryOpts(query, relatedEntities);
        return entity.findAndCountAll(opts).then(data => data).catch(sequelizeError);
    },
    options: {}
};

internals.findOne = {
    method: (entity, id, relatedEntities) => {
        return entity.findById(id, {include: relatedEntities}).then((data) => {
            if (!data)
                throw new EntityNotFoundException(entity.name + ' resource not found');
            return data;
        }).catch(sequelizeError);
    },
    options: {}
};

internals.create = {
    method: (entity, data, relatedEntities = null) => {

        if (_.isArray(data)) {
            return entity.bulkCreate(data).then(data => data).catch(sequelizeError);
        } else {
            if(relatedEntities) {
                return entity.build(data, {include: relatedEntities}).save().then(data => data).catch(sequelizeError);
            }
            return entity.build(data).save().then(data => data).catch(sequelizeError);
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
                    return user.save().then(data => data).catch(sequelizeError);
                else
                    return user;
            }).catch(sequelizeError);
    }
};

internals.delete = {
    method: (entity, id) => {

        return entity.findById(id)
            .then((user) => {
                if (!user)
                    throw new EntityNotFoundException(entity.name + ' resource not found');
                return user.destroy().then(data => data).catch(sequelizeError);
            });
    }
};