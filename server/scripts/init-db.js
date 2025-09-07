#!/usr/bin/env node

/**
 * Database Initialization Script for ReNova
 * This script runs migrations and seeds for production deployment
 */

require('dotenv').config();
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

async function initializeDatabase() {
  console.log('🔄 Initializing ReNova database...');
  
  try {
    // Check if we can connect to the database
    console.log('🔄 Testing database connection...');
    const { sequelize } = require('../models');
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
    
    // Run migrations
    console.log('🔄 Running database migrations...');
    const { stdout: migrateOutput, stderr: migrateError } = await execAsync('npx sequelize-cli db:migrate');
    if (migrateOutput) console.log('📄 Migration output:', migrateOutput);
    if (migrateError) console.log('⚠️ Migration warnings:', migrateError);
    console.log('✅ Database migrations completed');
    
    // Run seeds
    console.log('🔄 Running database seeds...');
    const { stdout: seedOutput, stderr: seedError } = await execAsync('npx sequelize-cli db:seed:all');
    if (seedOutput) console.log('📄 Seed output:', seedOutput);
    if (seedError) console.log('⚠️ Seed warnings:', seedError);
    console.log('✅ Database seeds completed');
    
    console.log('🎉 Database initialization completed successfully!');
    console.log('');
    console.log('Demo credentials:');
    console.log('Email: demo@renova.com');
    console.log('Password: demo1234');
    
    await sequelize.close();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    console.error('❌ Full error:', error);
    
    if (error.message.includes('relation') && error.message.includes('does not exist')) {
      console.error('💡 This might be the first run. Migrations should create the tables.');
    }
    
    if (error.message.includes('already exists')) {
      console.log('ℹ️ Database tables already exist. This is normal for subsequent deployments.');
      process.exit(0);
    }
    
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;
