const { models } = require('../../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;

module.exports = {
    orderList: (fromDate, toDate) => models.order.findAll({
        raw: true,
        order: [
            ['created_at', 'ASC'],
        ],
        where: {
            created_at: {
                [Op.lt]: toDate,
                [Op.gt]: fromDate
            },
            status: "Success",
        }
    }),
    topList: () => models.order_details.findAll({
        raw: true,
        attributes: [
            'id', 'product_id', [sequelize.fn('sum', sequelize.col('quantity')), 'total'],
        ],
        group: ['id'],
        order: sequelize.literal('total DESC'),
        limit: 10,
    }),
    findProductNameById: (id) => models.product.findOne({
        where: {
            id: id
        },
        raw: true
    }),
}