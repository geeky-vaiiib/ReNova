'use strict';

module.exports = (sequelize, DataTypes) => {
  const CartItem = sequelize.define('CartItem', {
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
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id'
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
    tableName: 'CartItems',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'productId']
      },
      {
        fields: ['userId']
      },
      {
        fields: ['productId']
      }
    ]
  });

  // Instance methods
  CartItem.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    return values;
  };

  // Associations
  CartItem.associate = function(models) {
    CartItem.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    CartItem.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product'
    });
  };

  return CartItem;
};
