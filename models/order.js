const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('order', {
    id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    customer_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: 'customer',
        key: 'id'
      }
    },
    receiver_address_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'receiver_address',
        key: 'id'
      }
    },
    total: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    note: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'order',
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
        name: "fk_order_receiver_address1_idx",
        using: "BTREE",
        fields: [
          { name: "receiver_address_id" },
        ]
      },
      {
        name: "fk_order_customer_idx",
        using: "BTREE",
        fields: [
          { name: "customer_id" },
        ]
      },
    ]
  });
};
