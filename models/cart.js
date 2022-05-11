const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cart', {
    customer_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'customer',
        key: 'id'
      }
    },
    total_products: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'cart',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "customer_id" },
        ]
      },
      {
        name: "fk_cart_customer1_idx",
        using: "BTREE",
        fields: [
          { name: "customer_id" },
        ]
      },
    ]
  });
};
