'use strict';

module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('OrderItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Orders',
        key: 'id'
      }
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id'
      }
    },
    priceAtPurchase: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
        isDecimal: true
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
        max: 99
      }
    }
  }, {
    tableName: 'OrderItems',
    timestamps: true,
    indexes: [
      {
        fields: ['orderId']
      },
      {
        fields: ['productId']
      }
    ]
  });

  // Instance methods
  OrderItem.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    
    // Convert priceAtPurchase to number for JSON response
    if (values.priceAtPurchase) {
      values.priceAtPurchase = parseFloat(values.priceAtPurchase);
    }
    
    return values;
  };

  // Associations
  OrderItem.associate = function(models) {
    OrderItem.belongsTo(models.Order, {
      foreignKey: 'orderId',
      as: 'order'
    });

    OrderItem.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product'
    });
  };

  return OrderItem;
};
