const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { models } = require('../../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;

module.exports = {
    list: (page = 0, itemsPerPage = 5) => models.admin.findAndCountAll({
        raw: true,
        offset: itemsPerPage * page,
        limit: itemsPerPage
    }),
    search: (keyword, page = 0, itemsPerPage = 5) => models.admin.findAndCountAll({
        where: {
            [Op.or]: [
                sequelize.where(sequelize.fn('concat', sequelize.col('last_name'), ' ', sequelize.col('first_name')), {
                    [Op.like]: `%${keyword}%`
                })
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
                }, {
                    telephone: {
                        [Op.like]: `%${keyword}%`
                    }  
                }
            ]
        },
        offset: itemsPerPage * page,
        limit: itemsPerPage,
    }),
    addAdmin: async(lastName, firstName, username, password, email, telephone) => {
        const checkUsername = await models.admin.findOne({ where: { username: username }, raw: true })
        if (checkUsername) {
            throw new Error('Username is already taken!');
        }
        const checkEmail = await models.admin.findOne({ where: { email: email }, raw: true })
        if (checkEmail) {
            throw new Error('Email is already taken!');
        }
        const hashPassword = await bcrypt.hash(password, 10);
        return await models.admin.create({
            id: uuidv4(),
            last_name: lastName,
            first_name: firstName,
            username: username,
            password: hashPassword,
            email: email,
            telephone: telephone,
        });
    },
    findAdminById: id => models.admin.findByPk(id),
    removeAdmin: id => models.admin.destroy({
        where: {
            id: id
        },
    }),
    updateAdmin: async(id, lastName, firstName, email, telephone) => {
        const checkEmail = await models.admin.findOne({
            where: {
                email: email,
                id: {
                    [Op.not]: id
                }
            },
            raw: true
        })
        if (checkEmail) {
            throw new Error('Email is already taken!');
        }
        return models.admin.update({
            last_name: lastName,
            first_name: firstName,
            email: email,
            telephone: telephone,
        }, {
            where: {
                id: id,
            },
        });
    },
    lockAdmin: id => models.admin.update({
        lock: 1,
    }, {
        where: {
            id
        },
    }),
    unlockAdmin: id => models.admin.update({
        lock: 0,
    }, {
        where: {
            id
        },
    }),
}