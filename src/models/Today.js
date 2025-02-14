const { DataTypes } = require("sequelize");
const sequelize = require("../config/databaseConfig");
const User = require("./User");
const List = require("./List");

const Today = sequelize.define(
  "Today",
  {
    TodayID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "user",
        key: "UserID",
      },
    },
    ListID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "list",
        key: "ListID",
      },
    },
    Subtask: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Task: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Deskripsi: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    TanggalTask: {
      type: DataTypes.DATE,
    },
    IsCompleted: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },
    CompletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    CreatedAt: DataTypes.DATE,
    UpdatedAt: DataTypes.DATE,
    DeletedAt: DataTypes.DATE,
  },
  {
    tableName: "today",
    timestamps: true,
    paranoid: true,
  }
);

User.hasMany(Today, { foreignKey: "UserID" });
Today.belongsTo(User, { foreignKey: "UserID" });

List.hasMany(Today, { foreignKey: "ListID" });
Today.belongsTo(List, { foreignKey: "ListID" });

module.exports = Today;
