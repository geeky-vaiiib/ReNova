'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(12);
    
    const users = [
      {
        username: 'demo',
        email: 'demo@ecofinds.com',
        passwordHash: await bcrypt.hash('demo1234', salt),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'sarah_vintage',
        email: 'sarah@example.com',
        passwordHash: await bcrypt.hash('password123', salt),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'tech_reseller',
        email: 'tech@example.com',
        passwordHash: await bcrypt.hash('password123', salt),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'furniture_lover',
        email: 'furniture@example.com',
        passwordHash: await bcrypt.hash('password123', salt),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'bike_enthusiast',
        email: 'bike@example.com',
        passwordHash: await bcrypt.hash('password123', salt),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'student_seller',
        email: 'student@example.com',
        passwordHash: await bcrypt.hash('password123', salt),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'music_collector',
        email: 'music@example.com',
        passwordHash: await bcrypt.hash('password123', salt),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('Users', users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
