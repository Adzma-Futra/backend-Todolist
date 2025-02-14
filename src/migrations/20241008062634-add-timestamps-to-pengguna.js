"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Menambahkan kolom createdAt
    await queryInterface.addColumn("pengguna", "createdAt", {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });

    // Menambahkan kolom updatedAt
    await queryInterface.addColumn("pengguna", "updatedAt", {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal(
        "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
      ),
    });

    // Menambahkan kolom accessToken
    await queryInterface.addColumn("pengguna", "accessToken", {
      type: Sequelize.STRING,
      allowNull: true, // accessToken bisa nullable pada awalnya
    });

    // Menambahkan kolom lastLogin
    await queryInterface.addColumn("pengguna", "lastLogin", {
      type: Sequelize.DATE,
      allowNull: true, // lastLogin bisa nullable karena user mungkin belum pernah login
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Menghapus kolom createdAt
    await queryInterface.removeColumn("pengguna", "createdAt");

    // Menghapus kolom updatedAt
    await queryInterface.removeColumn("pengguna", "updatedAt");

    // Menghapus kolom accessToken
    await queryInterface.removeColumn("pengguna", "accessToken");

    // Menghapus kolom lastLogin
    await queryInterface.removeColumn("pengguna", "lastLogin");
  },
};
