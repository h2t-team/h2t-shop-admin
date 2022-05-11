const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('order_details', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    order_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: 'order',
        key: 'id'
      }
    },
    product_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: 'product',
        key: 'id'
      }
    },
    size: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'order_details',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "id_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "fk_order_detail_product_idx",
        using: "BTREE",
        fields: [
          { name: "product_id" },
        ]
      },
      {
        name: "fk_detail_order_idx",
        using: "BTREE",
        fields: [
          { name: "order_id" },
        ]
      },
    ]
  });
};
