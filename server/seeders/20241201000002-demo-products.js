'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const products = [
      {
        title: 'iPhone 12 Pro',
        description: 'Unlocked iPhone 12 Pro, 128GB storage, Pacific Blue color. Minor scratches on the back but screen is perfect. Includes original charger.',
        category: 'Electronics',
        price: 35000.00,
        imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
        ownerId: 12, // tech_reseller
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Wooden Study Table',
        description: 'Handcrafted teak wood study table, perfect for home office. Solid wood construction with beautiful grain pattern. Dimensions: 4ft x 2ft.',
        category: 'Furniture',
        price: 2500.00,
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
        ownerId: 13, // furniture_lover
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Cricket Bat - SS',
        description: 'SS cricket bat, English willow, excellent condition. Perfect for club level cricket. Well maintained with anti-scuff sheet.',
        category: 'Sports',
        price: 1200.00,
        imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=300&fit=crop',
        ownerId: 14, // bike_enthusiast
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Microwave Oven - LG',
        description: 'LG 20L microwave oven, convection mode, excellent working condition. Perfect for small families. Includes all accessories.',
        category: 'Kitchen',
        price: 4000.00,
        imageUrl: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=300&fit=crop',
        ownerId: 16, // music_collector
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Bluetooth Headphones - Sony',
        description: 'Sony WH-CH720N wireless headphones with noise cancellation. Excellent sound quality, 35-hour battery life.',
        category: 'Electronics',
        price: 1800.00,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
        ownerId: 12, // tech_reseller
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Office Chair - Ergonomic',
        description: 'Ergonomic office chair with lumbar support and adjustable height. Black mesh design. Very comfortable for long work sessions.',
        category: 'Furniture',
        price: 3000.00,
        imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop',
        ownerId: 13, // furniture_lover
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Winter Jacket - North Face',
        description: 'North Face winter jacket, size L, excellent condition. Perfect for cold weather. Water-resistant and warm.',
        category: 'Fashion',
        price: 1500.00,
        imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop',
        ownerId: 11, // sarah_vintage
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Harry Potter Book Set',
        description: 'Complete Harry Potter book series, all 7 books in excellent condition. Perfect for collectors or first-time readers.',
        category: 'Books',
        price: 2200.00,
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
        ownerId: 15, // student_seller
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'MacBook Air M1',
        description: 'Apple MacBook Air with M1 chip, 8GB RAM, 256GB SSD. Excellent condition, barely used. Includes original box and charger.',
        category: 'Electronics',
        price: 65000.00,
        imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop',
        ownerId: 12, // tech_reseller
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Badminton Racket - Yonex',
        description: 'Yonex badminton racket, professional grade. Excellent condition with new grip. Perfect for competitive play.',
        category: 'Sports',
        price: 800.00,
        imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
        ownerId: 14, // bike_enthusiast
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Acoustic Guitar - Yamaha',
        description: 'Yamaha F310 acoustic guitar in excellent condition. Perfect for beginners or experienced players. Includes guitar case and picks.',
        category: 'Music',
        price: 3500.00,
        imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
        ownerId: 16, // music_collector
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Pressure Cooker - Hawkins',
        description: 'Hawkins 5L pressure cooker, excellent condition. Perfect for Indian cooking. Includes all safety features.',
        category: 'Kitchen',
        price: 1200.00,
        imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
        ownerId: 16, // music_collector
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'iPad Pro 11-inch',
        description: 'iPad Pro 11-inch with Apple Pencil. Perfect for digital art and productivity. 128GB storage, WiFi model.',
        category: 'Electronics',
        price: 45000.00,
        imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
        ownerId: 12, // tech_reseller
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Wooden Bookshelf',
        description: '5-tier wooden bookshelf, perfect for home office or living room. Solid construction, easy to assemble.',
        category: 'Furniture',
        price: 2800.00,
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
        ownerId: 13, // furniture_lover
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Football - Nike',
        description: 'Official size football, excellent condition. Nike brand, perfect for practice and matches.',
        category: 'Sports',
        price: 600.00,
        imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop',
        ownerId: 14, // bike_enthusiast
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Indian Cookbook Collection',
        description: 'Set of 3 popular Indian cookbooks including regional cuisines and traditional recipes. All in excellent condition.',
        category: 'Books',
        price: 900.00,
        imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
        ownerId: 15, // student_seller
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Rice Cooker - Panasonic',
        description: 'Panasonic 1.8L rice cooker, excellent working condition. Perfect for Indian families. Non-stick inner pot.',
        category: 'Kitchen',
        price: 2200.00,
        imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
        ownerId: 16, // music_collector
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('Products', products, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
