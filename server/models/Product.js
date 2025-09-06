'use strict';

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [3, 100],
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [10, 1000],
        notEmpty: true
      }
    },
    category: {
      type: DataTypes.ENUM('Clothing', 'Electronics', 'Furniture', 'Sports', 'Books', 'Music', 'Other'),
      allowNull: false,
      defaultValue: 'Other'
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0.01,
        isDecimal: true
      }
    },
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        isUrl: {
          msg: 'Must be a valid URL'
        }
      }
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    tableName: 'Products',
    timestamps: true,
    indexes: [
      {
        fields: ['ownerId']
      },
      {
        fields: ['category']
      },
      {
        fields: ['title']
      },
      {
        fields: ['createdAt']
      }
    ]
  });

  // Instance methods
  Product.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    
    // Convert price to number for JSON response
    if (values.price) {
      values.price = parseFloat(values.price);
    }
    
    return values;
  };

  // Associations
  Product.associate = function(models) {
    Product.belongsTo(models.User, {
      foreignKey: 'ownerId',
      as: 'owner'
    });

    Product.hasMany(models.CartItem, {
      foreignKey: 'productId',
      as: 'cartItems',
      onDelete: 'CASCADE'
    });

    Product.hasMany(models.OrderItem, {
      foreignKey: 'productId',
      as: 'orderItems',
      onDelete: 'RESTRICT' // Don't allow deletion if product is in orders
    });
  };

  return Product;
};
