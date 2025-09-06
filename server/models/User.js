'use strict';

const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 30],
        isAlphanumeric: true
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'Users',
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.passwordHash) {
          const salt = await bcrypt.genSalt(12);
          user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('passwordHash')) {
          const salt = await bcrypt.genSalt(12);
          user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
        }
      }
    }
  });

  // Instance methods
  User.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.passwordHash);
  };

  User.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    delete values.passwordHash;
    return values;
  };

  // Associations
  User.associate = function(models) {
    User.hasMany(models.Product, {
      foreignKey: 'ownerId',
      as: 'products',
      onDelete: 'CASCADE'
    });

    User.hasMany(models.CartItem, {
      foreignKey: 'userId',
      as: 'cartItems',
      onDelete: 'CASCADE'
    });

    User.hasMany(models.Order, {
      foreignKey: 'userId',
      as: 'orders',
      onDelete: 'CASCADE'
    });
  };

  return User;
};
