const { models } = require('../../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;

const listConfig = {
    raw: true,
    attributes: [
        'id',
        'name',
        'category_id',
        'price',
        'rate'
    ],
    include: [{
        model: models.category,
        as: 'category',
        attributes: ['name', 'parent_id'],
        required: true
    }, {
        model: models.product_image,
        as: 'product_images',
        attributes: ['product_id', 'image_url'],
        duplicating: false,
    }],
    group: ['product.id'],
    order: [
        ['id', 'ASC']
    ],
}

module.exports = {
    list: (page = 0, itemsPerPage = 8) => models.product.findAndCountAll({
        ...listConfig,
        offset: itemsPerPage * page,
        limit: itemsPerPage
    }),
    category: () => models.category.findAll({
        raw: true
    }),
    search: (category, keyword, page = 0, itemsPerPage = 8) => models.product.findAndCountAll({
        ...listConfig,
        where: {
            [Op.and]: [{
                [Op.or]: [{
                    name: {
                        [Op.like]: `%${keyword}%`
                    }
                }, {
                    price: {
                        [Op.like]: `%${keyword}%`
                    }
                }, {
                    rate: {
                        [Op.like]: `%${keyword}%`
                    }
                }]
            }, {
                [Op.or]: [{
                        '$category.id$': {
                            [Op.like]: `%${category}%`
                        },
                    },
                    {
                        '$category.parent_id$': {
                            [Op.like]: `%${category}%`
                        },
                    },
                ]
            }]
        },
        offset: itemsPerPage * page,
        limit: itemsPerPage,
    }),
    updateCategoryCount: (category_id, num) => models.category.update({
        total_products: num
    }, {
        where: {
            id: category_id
        },
    }),
    findTotalByCategory: category_id => models.category.findOne({
        attributes: ['total_products', 'parent_id'],
        where: {
            id: category_id
        },
        raw: true
    }),
    addProduct: (id, name, category_id, price, description, sizes, imageUrls) => models.product.create({
            id,
            category_id,
            name,
            price,
            description,
            rate: 0
        })
        .then(async res => {
            for (let i = 0; i < imageUrls.length; i++) {
                await models.product_image.create({
                    product_id: id,
                    image_url: imageUrls[i]
                })
            }
            return Promise.resolve(id);
        })
        .then(async res => {
            for (let key in sizes) {
                await models.product_size.create({
                    product_id: id,
                    size: key,
                    quantity: sizes[key]
                })
            }
        })
        .then(async res => {
            try {
                //plus 1 for new category and parent categories
                var { total_products, parent_id } = await module.exports.findTotalByCategory(category_id);
                await module.exports.updateCategoryCount(category_id, total_products + 1);
                var new_parent_id = parent_id;
                while (new_parent_id != null) {
                    var { total_products, parent_id } = await module.exports.findTotalByCategory(new_parent_id);
                    await module.exports.updateCategoryCount(new_parent_id, total_products + 1);
                    new_parent_id = parent_id;
                }
            } catch (err) {
                console.log(err.message);
            }
        }),
    removeProduct: (id, category_id) => models.product_image.destroy({
            where: {
                product_id: id
            },
        })
        .then(res => models.product_size.destroy({
            where: {
                product_id: id
            },
        }))
        .then(async(res) => {
            try {
                //subtract 1 for old category and parent categories
                var { total_products, parent_id } = await module.exports.findTotalByCategory(category_id);
                await module.exports.updateCategoryCount(category_id, total_products - 1);
                var new_parent_id = parent_id;
                while (new_parent_id != null) {
                    var { total_products, parent_id } = await module.exports.findTotalByCategory(new_parent_id);
                    await module.exports.updateCategoryCount(new_parent_id, total_products - 1);
                    new_parent_id = parent_id;
                }
            } catch (err) {
                console.log(err.message);
            }
        })
        .then(res => models.product.destroy({
            where: {
                id
            },
        })),
    findProductById: id => models.product.findByPk(id),
    findCategoryById: id => models.category.findByPk(id),
    findProductSizeById: id => models.product_size.findAll({
        where: {
            product_id: id
        },
        raw: true
    }),
    findProductImageById: id => models.product_image.findAll({
        where: {
            product_id: id
        },
        raw: true
    }),
    removeCurrentProductCategory: (category, categoryOfProduct) => {
        const index = category.map(function(e) { return e.id; }).indexOf(categoryOfProduct.id);
        if (index > -1) {
            category.splice(index, 1);
        }
        return category;
    },
    updateProduct: (id, name, category_id, price, description, rate, size, oldCategory_id) => models.product.update({
            category_id: category_id,
            name: name,
            price: price,
            description: description,
            rate: rate
        }, {
            where: {
                id: id,
            },
        })
        .then(async(res) => {
            for (let key in size) {
                await models.product_size.update({
                    quantity: size[key]
                }, {
                    where: {
                        product_id: id,
                        size: key,
                    },
                })
            }
        })
        .then(async(res) => {
            try {
                if (oldCategory_id != category_id) {
                    //subtract 1 for old category and parent categories
                    var { total_products, parent_id } = await module.exports.findTotalByCategory(oldCategory_id);
                    await module.exports.updateCategoryCount(oldCategory_id, total_products - 1);
                    var new_parent_id = parent_id;
                    while (new_parent_id != null) {
                        var { total_products, parent_id } = await module.exports.findTotalByCategory(new_parent_id);
                        await module.exports.updateCategoryCount(new_parent_id, total_products - 1);
                        new_parent_id = parent_id;
                    }
                    //plus 1 for new category and parent categories
                    var { total_products, parent_id } = await module.exports.findTotalByCategory(category_id);
                    await module.exports.updateCategoryCount(category_id, total_products + 1);
                    var new_parent_id = parent_id;
                    while (new_parent_id != null) {
                        var { total_products, parent_id } = await module.exports.findTotalByCategory(new_parent_id);
                        await module.exports.updateCategoryCount(new_parent_id, total_products + 1);
                        new_parent_id = parent_id;
                    }
                }
            } catch (err) {
                console.log(err.message);
            }
        }),
}