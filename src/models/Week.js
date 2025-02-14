const { DataTypes } = require("sequelize");
const sequelize = require("../config/databaseConfig");
const User = require("./User");

const Week = sequelize.define(
  "Week",
  {
    WeekID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    EventTitleWeek: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Warna: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Hari: {
      type: DataTypes.ENUM("Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"),
      allowNull: false,
    },
    Deskripsi: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "user",
        key: "UserID",
      },
    },
    CreatedAt: DataTypes.DATE,
    UpdatedAt: DataTypes.DATE,
    DeletedAt: DataTypes.DATE,
  },
  {
    tableName: "week",
    timestamps: true,
    paranoid: true,
  }
);

User.hasMany(Week, { foreignKey: "UserID" });
Week.belongsTo(User, { foreignKey: "UserID" });

module.exports = Week;
