'use strict';

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
        isDecimal: true
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending'
    }
  }, {
    tableName: 'Orders',
    timestamps: true,
    indexes: [
      {
        fields: ['userId']
      },
      {
        fields: ['status']
      },
      {
        fields: ['createdAt']
      }
    ]
  });

  // Instance methods
  Order.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    
    // Convert total to number for JSON response
    if (values.total) {
      values.total = parseFloat(values.total);
    }
    
    return values;
  };

  // Associations
  Order.associate = function(models) {
    Order.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    Order.hasMany(models.OrderItem, {
      foreignKey: 'orderId',
      as: 'orderItems',
      onDelete: 'CASCADE'
    });
  };

  return Order;
};
