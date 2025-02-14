const { Sequelize } = require("sequelize");
require("dotenv").config();

// Menentukan opsi logging berdasarkan variabel lingkungan
const loggingOption = process.env.DB_LOGGING === "true" ? console.log : false;

// Membuat instance Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    logging: loggingOption,
  }
);

// Mengautentikasi koneksi ke database
sequelize
  .authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.log("Error: " + err));

module.exports = sequelize;
