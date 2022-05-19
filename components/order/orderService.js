const { models } = require('../../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;

const listConfig = {
    raw: true,
    attributes: [
        'id',
        'status',
        'total',
        'created_at'
    ],
    include: [{
            model: models.receiver_address,
            as: 'receiver_address',
            required: true
        },
    ]
}

module.exports = {
    list: (page = 0, itemsPerPage = 8) => models.order.findAndCountAll({ 
        ...listConfig,
        offset: itemsPerPage * page,
        limit: itemsPerPage
    }),
    findOrderById: id => models.order.findByPk(id, {
        ...listConfig
    }),
    findOrderDetailsById: id => models.order_details.findAll({
        raw: true,
        attributes: [
            [sequelize.fn('sum', sequelize.col('quantity')), 'product_amount'],
            [sequelize.fn('sum', sequelize.col('order_details.price')), 'product_price']
        ],
        where: {
            order_id: id
        },
        include: [
            {
                model: models.product,
                as: 'product',
                required: true,
                attributes: ['name']
            }
        ],
        group: ['product_id']
    }),
    sumOrder: id => models.order_details.findOne({
        raw: true,
        attributes: [
            [sequelize.fn('sum', sequelize.col('order_details.price')), 'total']
        ],
        where: {
            order_id: id
        }
    }),
    search: (status, keyword, page = 0, itemsPerPage = 8) => models.order.findAndCountAll({
        ...listConfig,
        where: {
            status: {
                [Op.like]: `%${status}%`
            },
            [Op.or]: [
                {
                    total: {
                        [Op.like]: `%${keyword}%`
                    }  
                }, {
                    '$receiver_address.receiver_name$': {
                        [Op.like]: `%${keyword}%`
                    }  
                }, {
                    '$receiver_address.city$': {
                        [Op.like]: `%${keyword}%`
                    }  
                }, {
                    '$receiver_address.district$': {
                        [Op.like]: `%${keyword}%`
                    }  
                }, {
                    '$receiver_address.ward$': {
                        [Op.like]: `%${keyword}%`
                    }  
                }, {
                    '$receiver_address.specific_address$': {
                        [Op.like]: `%${keyword}%`
                    }  
                }
            ]
        },
        offset: itemsPerPage * page,
        limit: itemsPerPage
    }),
    updateStatus: (id, status) => models.order.update({
        status: status
    }, {
        where: {
            id: id
        }
    })
}


