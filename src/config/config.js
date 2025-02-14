require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    migrationStorageTableName: "migrations",
    migrationStorage: "sequelize",
    migrations: {
      path: "src/migrations", // Definisikan path baru untuk migrations
      pattern: /\.js$/,
    },
    seederStorage: "sequelize",
    seederStorageTableName: "seeders",
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    migrationStorageTableName: "migrations",
    migrations: {
      path: "src/migrations",
      pattern: /\.js$/,
    },
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    migrationStorageTableName: "migrations",
    migrations: {
      path: "src/migrations",
      pattern: /\.js$/,
    },
  },
};
