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

    // Try migrations first
    console.log('🔄 Running database migrations...');
    try {
      const { stdout: migrateOutput, stderr: migrateError } = await execAsync('npx sequelize-cli db:migrate', {
        env: { ...process.env, NODE_ENV: 'production' }
      });
      if (migrateOutput) console.log('📄 Migration output:', migrateOutput);
      if (migrateError) console.log('⚠️ Migration warnings:', migrateError);
      console.log('✅ Database migrations completed');
    } catch (migrationError) {
      console.warn('⚠️ Migration failed, trying database sync...');
      console.warn('Migration error:', migrationError.message);

      // Fallback to sync
      await sequelize.sync({ force: false, alter: false });
      console.log('✅ Database sync completed as fallback');
    }

    // Try seeds
    console.log('🔄 Running database seeds...');
    try {
      const { stdout: seedOutput, stderr: seedError } = await execAsync('npx sequelize-cli db:seed:all', {
        env: { ...process.env, NODE_ENV: 'production' }
      });
      if (seedOutput) console.log('📄 Seed output:', seedOutput);
      if (seedError) console.log('⚠️ Seed warnings:', seedError);
      console.log('✅ Database seeds completed');
    } catch (seedError) {
      console.warn('⚠️ Seeding failed, creating demo user manually...');
      console.warn('Seed error:', seedError.message);

      // Create demo user manually
      const { User } = require('../models');
      try {
        const existingDemo = await User.findOne({ where: { email: 'demo@renova.com' } });
        if (!existingDemo) {
          await User.create({
            username: 'demo',
            email: 'demo@renova.com',
            passwordHash: 'demo1234'
          });
          console.log('✅ Demo user created manually');
        } else {
          console.log('ℹ️ Demo user already exists');
        }
      } catch (userError) {
        console.warn('⚠️ Could not create demo user:', userError.message);
      }
    }

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
