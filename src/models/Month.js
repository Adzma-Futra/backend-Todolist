const { DataTypes } = require("sequelize");
const sequelize = require("../config/databaseConfig");
const User = require("./User");

const Month = sequelize.define(
  "Month",
  {
    MonthID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    EventTitleMonth: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Warna: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Week: {
      type: DataTypes.ENUM(
        "Week1",
        "Week2",
        "Week3",
        "Week4",
      ),
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
    tableName: "month",
    timestamps: true,
    paranoid: true,
  }
);

User.hasMany(Month, { foreignKey: "UserID" });
Month.belongsTo(User, { foreignKey: "UserID" });

module.exports = Month;
