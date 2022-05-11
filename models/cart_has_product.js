const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cart_has_product', {
    customer_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: 'cart',
        key: 'customer_id'
      }
    },
    product_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: 'product',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'cart_has_product',
    timestamps: false,
    indexes: [
      {
        name: "fk_cart_has_product_cart1_idx",
        using: "BTREE",
        fields: [
          { name: "customer_id" },
        ]
      },
      {
        name: "fk_cart_has_product_product_idx",
        using: "BTREE",
        fields: [
          { name: "product_id" },
        ]
      },
    ]
  });
};
