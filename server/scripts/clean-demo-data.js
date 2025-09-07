#!/usr/bin/env node

/**
 * Clean Demo Data Script for ReNova
 * This script removes all demo/seed data from the database
 */

require('dotenv').config();
const { sequelize, User, Product, Order, OrderItem, CartItem } = require('../models');

async function cleanDemoData() {
  console.log('🧹 Cleaning demo data from ReNova database...');
  
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
    
    // Start transaction
    const transaction = await sequelize.transaction();
    
    try {
      // Delete all order items first (foreign key constraints)
      const orderItemsDeleted = await OrderItem.destroy({ 
        where: {},
        transaction 
      });
      console.log(`🗑️ Deleted ${orderItemsDeleted} order items`);
      
      // Delete all orders
      const ordersDeleted = await Order.destroy({ 
        where: {},
        transaction 
      });
      console.log(`🗑️ Deleted ${ordersDeleted} orders`);
      
      // Delete all cart items
      const cartItemsDeleted = await CartItem.destroy({ 
        where: {},
        transaction 
      });
      console.log(`🗑️ Deleted ${cartItemsDeleted} cart items`);
      
      // Delete all products
      const productsDeleted = await Product.destroy({ 
        where: {},
        transaction 
      });
      console.log(`🗑️ Deleted ${productsDeleted} products`);
      
      // Delete demo users (keep real users)
      const demoUsersDeleted = await User.destroy({ 
        where: {
          email: {
            [sequelize.Sequelize.Op.in]: [
              'demo@renova.com',
              'john@example.com',
              'sarah@example.com',
              'mike@example.com',
              'emma@example.com'
            ]
          }
        },
        transaction 
      });
      console.log(`🗑️ Deleted ${demoUsersDeleted} demo users`);
      
      // Commit transaction
      await transaction.commit();
      
      // Reset auto-increment sequences
      await sequelize.query('ALTER SEQUENCE "Users_id_seq" RESTART WITH 1');
      await sequelize.query('ALTER SEQUENCE "Products_id_seq" RESTART WITH 1');
      await sequelize.query('ALTER SEQUENCE "Orders_id_seq" RESTART WITH 1');
      await sequelize.query('ALTER SEQUENCE "OrderItems_id_seq" RESTART WITH 1');
      await sequelize.query('ALTER SEQUENCE "CartItems_id_seq" RESTART WITH 1');
      console.log('🔄 Reset auto-increment sequences');
      
      console.log('🎉 Demo data cleanup completed successfully!');
      console.log('');
      console.log('✅ Database is now clean and ready for real users');
      console.log('✅ All demo orders, products, and users have been removed');
      console.log('✅ Auto-increment IDs have been reset');
      
    } catch (error) {
      // Rollback transaction on error
      await transaction.rollback();
      throw error;
    }
    
  } catch (error) {
    console.error('❌ Failed to clean demo data:', error.message);
    console.error('❌ Full error:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run if called directly
if (require.main === module) {
  cleanDemoData();
}

module.exports = cleanDemoData;
