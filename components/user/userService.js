const { models } = require('../../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;

module.exports = {
    list: (page = 0, itemsPerPage = 5) => models.customer.findAndCountAll({
        raw: true,
        offset: itemsPerPage * page,
        limit: itemsPerPage
    }),
    search: (keyword, page = 0, itemsPerPage = 5) => models.customer.findAndCountAll({
        where: {
            [Op.or]: [
                // sequelize.where(sequelize.fn('concat', sequelize.col('last_name'), ' ', sequelize.col('first_name')), {
                //     [Op.like]: `%${keyword}%`
                // })
                , {
                    last_name: {
                        [Op.like]: `%${keyword}%`
                    }
                }, {
                    first_name: {
                        [Op.like]: `%${keyword}%`
                    }
                }, {
                    username: {
                        [Op.like]: `%${keyword}%`
                    }
                }, {
                    email: {
                        [Op.like]: `%${keyword}%`
                    }
                }
            ]
        },
        offset: itemsPerPage * page,
        limit: itemsPerPage,
        raw: true
    }),
    lockUser: id => models.customer.update({
        lock: 1,
    }, {
        where: {
            id
        },
    }),
    unlockUser: id => models.customer.update({
        lock: 0,
    }, {
        where: {
            id
        },
    }),
    findUserById: id => models.customer.findByPk(id),
}