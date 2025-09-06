'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      category: {
        type: Sequelize.ENUM('Clothing', 'Electronics', 'Furniture', 'Sports', 'Books', 'Music', 'Other'),
        allowNull: false,
        defaultValue: 'Other'
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      imageUrl: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      ownerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('Products', ['ownerId']);
    await queryInterface.addIndex('Products', ['category']);
    await queryInterface.addIndex('Products', ['title']);
    await queryInterface.addIndex('Products', ['createdAt']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  }
};
