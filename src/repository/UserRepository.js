const User = require("../models/User");
const UserDto = require("../common/dto/UserDto");
const {
  comparePassword,
  hashPassword,
} = require("../common/utils/securityUtils");
const { where } = require("sequelize");
const { Op } = require("sequelize");

class UserRepository {
  async createUser(data) {
    try {
      if (!data.Email) throw new Error("Email harus disediakan");

      // Hash password sebelum menyimpan
      data.Password = await hashPassword(data.Password);

      const user = await User.create(data);
      return new UserDto(user);
    } catch (error) {
      throw new Error("Gagal membuat pengguna baru: " + error.message);
    }
  }

  async getAllUser(dto) {
    try {
      const page = dto.page || 1;
      const per_page = dto.per_page || 20;
      const offset = (page - 1) * per_page;

      const whereCondition = {
        ...(dto.search && { Username: { [Op.like]: `%${dto.search}%` } }),
      };

      const users = await User.findAndCountAll({
        where: whereCondition,
        limit: per_page,
        offset: offset,
        order: [["createdAt", "DESC"]],
      });
      console.log("Data yang diterima", users);
      return {
        List: users.rows.map((user) => {
          return new UserDto(user);
        }),
        totalItems: users.count,
        totalPage: Math.ceil(users.count / per_page),
        page: page,
        limit: per_page,
      };
    } catch (error) {
      console.log(error);
      throw new Error(
        "Gagal mendapatkan semua data pengguna: " + error.message
      );
    }
  }

  async getUserById(UserID) {
    try {
      const user = await User.findByPk(UserID);
      if (!user) {
        throw new Error("Pengguna tidak ditemukan");
      }
      console.log(user);
      return new UserDto(user);
    } catch (error) {
      throw new Error(
        "Gagal mendapatkan data pengguna berdasarkan id: " + error.message
      );
    }
  }

  async getUserByEmail(Email) {
    return await User.findOne({
      where: { Email: Email },
      attributes: ["UserID", "Username", "Password", "Email"],
    });
  }

  async updateUser(UserID, data) {
    try {
      // console.log(UserID, "ini id");
      const user = await User.findByPk(UserID);
      if (!user) {
        throw new Error("Pengguna tidak ditemukan");
      }

      await user.update(data);
      console.log(user);
      return new UserDto(user);
    } catch (error) {
      throw new Error("Gagal memperbarui data pengguna: " + error.message);
    }
  }

  async deleteUser(UserID) {
    try {
      const user = await User.findByPk(UserID);
      if (!user) {
        throw new Error("Pengguna tidak ditemukan");
      }

      await user.destroy();
      return { message: "Pengguna berhasil dihapus" };
    } catch (error) {
      throw new Error("Gagal menghapus pengguna: " + error.message);
    }
  }

  async updateAccessToken(UserID, AccessToken, LastLogin) {
    try {
      const user = await User.findByPk(UserID);
      if (!user) {
        throw new Error("Pengguna tidak ditemukan");
      }

      // Update token akses dan lastLogin
      await user.update({
        AccessToken: AccessToken,
        LastLogin: LastLogin,
      });

      return new UserDto(user);
    } catch (error) {
      throw new Error("Gagal membuat token akses: " + error.message);
    }
  }

  async updatePassword(UserID, oldPassword, newPassword) {
    try {
      const user = await User.findByPk(UserID);
      if (!user) {
        throw new Error("pengguna tidak ditemukan");
      }

      const isMatch = await comparePassword(oldPassword, user.Password);
      if (!isMatch) {
        throw new Error("kata sandi lama tidak cocok");
      }

      const hashedPassword = await hashPassword(newPassword);
      await user.update({ Password: hashedPassword });

      return new UserDto(user);
    } catch (error) {
      console.log(error);
      throw new Error("gagal memperbarui kata sandi baru: " + error.message);
    }
  }
}

module.exports = new UserRepository();
