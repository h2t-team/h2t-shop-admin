var DataTypes = require("sequelize").DataTypes;
var _admin = require("./admin");
var _cart = require("./cart");
var _cart_has_product = require("./cart_has_product");
var _category = require("./category");
var _customer = require("./customer");
var _feedback = require("./feedback");
var _order = require("./order");
var _order_details = require("./order_details");
var _product = require("./product");
var _product_image = require("./product_image");
var _product_size = require("./product_size");
var _receiver_address = require("./receiver_address");

function initModels(sequelize) {
  var admin = _admin(sequelize, DataTypes);
  var cart = _cart(sequelize, DataTypes);
  var cart_has_product = _cart_has_product(sequelize, DataTypes);
  var category = _category(sequelize, DataTypes);
  var customer = _customer(sequelize, DataTypes);
  var feedback = _feedback(sequelize, DataTypes);
  var order = _order(sequelize, DataTypes);
  var order_details = _order_details(sequelize, DataTypes);
  var product = _product(sequelize, DataTypes);
  var product_image = _product_image(sequelize, DataTypes);
  var product_size = _product_size(sequelize, DataTypes);
  var receiver_address = _receiver_address(sequelize, DataTypes);

  cart_has_product.belongsTo(cart, { as: "customer", foreignKey: "customer_id"});
  cart.hasMany(cart_has_product, { as: "cart_has_products", foreignKey: "customer_id"});
  category.belongsTo(category, { as: "parent", foreignKey: "parent_id"});
  category.hasMany(category, { as: "categories", foreignKey: "parent_id"});
  product.belongsTo(category, { as: "category", foreignKey: "category_id"});
  category.hasMany(product, { as: "products", foreignKey: "category_id"});
  cart.belongsTo(customer, { as: "customer", foreignKey: "customer_id"});
  customer.hasOne(cart, { as: "cart", foreignKey: "customer_id"});
  feedback.belongsTo(customer, { as: "customer", foreignKey: "customer_id"});
  customer.hasMany(feedback, { as: "feedbacks", foreignKey: "customer_id"});
  order.belongsTo(customer, { as: "customer", foreignKey: "customer_id"});
  customer.hasMany(order, { as: "orders", foreignKey: "customer_id"});
  receiver_address.belongsTo(customer, { as: "customer", foreignKey: "customer_id"});
  customer.hasMany(receiver_address, { as: "receiver_addresses", foreignKey: "customer_id"});
  order_details.belongsTo(order, { as: "order", foreignKey: "order_id"});
  order.hasMany(order_details, { as: "order_details", foreignKey: "order_id"});
  cart_has_product.belongsTo(product, { as: "product", foreignKey: "product_id"});
  product.hasMany(cart_has_product, { as: "cart_has_products", foreignKey: "product_id"});
  feedback.belongsTo(product, { as: "product", foreignKey: "product_id"});
  product.hasMany(feedback, { as: "feedbacks", foreignKey: "product_id"});
  order_details.belongsTo(product, { as: "product", foreignKey: "product_id"});
  product.hasMany(order_details, { as: "order_details", foreignKey: "product_id"});
  product_image.belongsTo(product, { as: "product", foreignKey: "product_id"});
  product.hasMany(product_image, { as: "product_images", foreignKey: "product_id"});
  product_size.belongsTo(product, { as: "product", foreignKey: "product_id"});
  product.hasMany(product_size, { as: "product_sizes", foreignKey: "product_id"});
  order.belongsTo(receiver_address, { as: "receiver_address", foreignKey: "receiver_address_id"});
  receiver_address.hasMany(order, { as: "orders", foreignKey: "receiver_address_id"});

  return {
    admin,
    cart,
    cart_has_product,
    category,
    customer,
    feedback,
    order,
    order_details,
    product,
    product_image,
    product_size,
    receiver_address,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
