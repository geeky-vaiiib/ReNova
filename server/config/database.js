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
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false,
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: false
    }
  }
};
