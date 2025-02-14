const { DataTypes } = require("sequelize");
const sequelize = require("../config/databaseConfig");

const User = sequelize.define(
  "User",
  {
    UserID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Username tidak boleh kosong",
        },
      },
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [6, 100],
          msg: "Password harus memiliki antara 6 hingga 100 karakter",
        },
      },
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "Email sudah terdaftar",
      },
      validate: {
        isEmail: {
          msg: "Format email tidak valid",
        },
        notEmpty: {
          msg: "Email tidak boleh kosong",
        },
      },
    },
    Profile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    AccessToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    CreatedAt: DataTypes.DATE,
    UpdatedAt: DataTypes.DATE,
    DeletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    LastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "user",
    timestamps: true,
    paranoid: true,
  }
);

module.exports = User;