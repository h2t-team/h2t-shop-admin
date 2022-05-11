const { models } = require('../../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;

module.exports = {
    list: () => models.category.findAll({
        raw: true,
        order: [
            ['parent_id', 'ASC'],
            ['name', 'ASC'],
        ],
    }),
    listSortNameAsc: () => models.category.findAll({
        raw: true,
        order: [
            ['name', 'ASC'],
        ],
    }),
    addCategory: async(name, description, parentId) => {
        return await models.category.create({
            name: name,
            description: description,
            parent_id: parentId == 0 ? null : parentId,
            total_products: 0,
        });
    },
    findCategoryById: id => models.category.findByPk(id),
    findTotalByCategory: category_id => models.category.findOne({
        attributes: ['total_products', 'parent_id'],
        where: {
            id: category_id
        },
        raw: true
    }),
    updateCategoryCount: async(category_id, num) => models.category.update({
        total_products: num
    }, {
        where: {
            id: category_id
        },
    }),
    updateCategory: async(id, name, description, parentId, oldParentId) => {
        try {
            if (oldParentId != parentId) {
                //subtract total products for old parent categories
                var { total_products, parent_id } = await module.exports.findTotalByCategory(id);
                var old_total_products = total_products;
                var old_parent_id = parent_id;
                while (old_parent_id != null) {
                    var { total_products, parent_id } = await module.exports.findCategoryById(old_parent_id);
                    await module.exports.updateCategoryCount(old_parent_id, total_products - old_total_products);
                    old_parent_id = parent_id;
                }
                //plus total products for new parent categories
                var { total_products, parent_id } = await module.exports.findTotalByCategory(id);
                var old_total_products = total_products;
                var old_parent_id = parent_id;
                var current_parent_id = parentId;
                while (current_parent_id != null) {
                    var { total_products, parent_id } = await module.exports.findTotalByCategory(current_parent_id);
                    await module.exports.updateCategoryCount(current_parent_id, total_products + old_total_products);
                    current_parent_id = parent_id;
                }
            }
        } catch (err) {
            console.log(err.message);
        }
        return await models.category.update({
            name: name,
            description: description,
            parent_id: parentId == 0 ? null : parentId,
        }, {
            where: {
                id: id,
            }
        });
    },
}