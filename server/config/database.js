require('dotenv').config();

module.exports = {
  development: {
    storage: './database.sqlite',
    dialect: 'sqlite',
    logging: console.log,
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: false
    }
  },
  test: {
    storage: './database_test.sqlite',
    dialect: 'sqlite',
    logging: false
  },
  production: {
    storage: process.env.DATABASE_URL || './database_prod.sqlite',
    dialect: 'sqlite',
    logging: false,
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: false
    }
  }
};
