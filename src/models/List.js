const { DataTypes } = require("sequelize");
const sequelize = require("../config/databaseConfig");
const User = require("./User");

const List = sequelize.define(
  "List",
  {
    ListID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    NamaList: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    WarnaList: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    TanggalList: {
      type: DataTypes.DATE,
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
    tableName: "list",
    timestamps: true,
    paranoid: true,
  }
);

User.hasMany(List, { foreignKey: "UserID" });
List.belongsTo(User, { foreignKey: "UserID" });

module.exports = List;