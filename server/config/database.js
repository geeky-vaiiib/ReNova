require('dotenv').config();

module.exports = {
  development: {
    // Use PostgreSQL for all environments
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    logging: console.log,
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: false
    }
  },
  test: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    logging: false,
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: false
    }
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
