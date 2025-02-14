const { DataTypes } = require("sequelize");
const sequelize = require("../config/databaseConfig");
const User = require("./User");

const Day = sequelize.define(
  "Day",
  {
    DayID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    EventTitleDay: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Warna: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Time: {
      type: DataTypes.STRING, // Disimpan sebagai string "14:00:00-15:00:00"
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
    tableName: "day",
    timestamps: true,
    paranoid: true,
  }
);

User.hasMany(Day, { foreignKey: "UserID" });
Day.belongsTo(User, { foreignKey: "UserID" });

module.exports = Day;
