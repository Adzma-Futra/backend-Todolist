const Month = require("../models/Month");
const MonthDto = require("../common/dto/MonthDto");
const User = require("../models/User");
const { Op } = require("sequelize");

class MonthRepository {
  async create(data, UserID) {
    try {
      const allowedWeek = ["Week1", "Week2", "Week3", "Week4"]; // Metode pembayaran yang diizinkan

      // Cek metode pembayaran
      if (!allowedWeek.includes(data.Week)) {
        throw new Error("Hari tidak valid");
      }

      // Cek apakah EventTitleMonth sudah ada
      const existingMonth = await Month.findOne({
        where: { EventTitleMonth: data.EventTitleMonth },
      });
      if (existingMonth) {
        throw new Error("Event Month sudah ada, gunakan nama lain.");
      }

      // Jika EventTitleMonth belum ada, buat Month baru
      const month = await Month.create({ ...data, UserID: UserID });
      console.log(month, "berhasil membuat data month");
      return new MonthDto(month);
    } catch (error) {
      throw new Error("Gagal membuat month: " + error.message);
    }
  }

  async getAll(dto) {
    try {
      const page = dto.page || 1;
      const per_page = dto.per_page || 30;
      const offset = (page - 1) * per_page;

      const whereClause = {
        ...(dto.search && { EventTitleMonth: { [Op.like]: `%${dto.search}%` } }),
      };

      // Pengurutan hasil berdasarkan input orderBy
      let order = [["CreatedAt", "DESC"]];

      const MonthData = await Month.findAndCountAll({
        where: whereClause,
        limit: per_page,
        offset: offset,
        order: order,
        include: [{ model: User, attributes: ["Username", "Profile"] }],
      });

      return {
        List: MonthData.rows.map((t) => {
          return new MonthDto(t);
        }),
        totalItems: MonthData.count,
        totalPage: Math.ceil(MonthData.count / per_page),
        page: page,
        limit: per_page,
      };
    } catch (error) {
      console.error(error); // Print error ke konsol untuk debugging
      throw new Error("Gagal mendapatkan data month: " + error.message);
    }
  }

  async getById(MonthID) {
    try {
      const month = await Month.findByPk(MonthID, {
        include: [
          { model: User, attributes: ["UserID", "Username", "Profile"] },
        ],
      });
      if (!month) {
        throw new Error("month tidak ditemukan");
      }

      return new MonthDto(month);
    } catch (error) {
      throw new Error("Gagal mendapatkan data month: " + error.message);
    }
  }

  async getByIdUser(UserID) {
    try {
      const month = await Month.findAll({
        where: { UserID: UserID },
        include: [
          { model: User, attributes: ["UserID", "Username", "Profile"] },
        ],
        order: [
          ["CreatedAt", "DESC"], // Mengurutkan berdasarkan createdAt secara menurun (terbaru)
        ],
      });
      console.log(month);
      return month.map((item) => {
        return new MonthDto(item);
      });
    } catch (error) {
      throw new Error(
        "Gagal mendapatkan data month berdasarkan id user: " + error.message
      );
    }
  }

  async update(MonthID, UserID, data) {
    try {
      const allowedWeek = ["Week1", "Week2", "Week3", "Week4"]; 

      // Cek metode pembayaran
      if (!allowedWeek.includes(data.Week)) {
        throw new Error("Hari tidak valid");
      }

      const month = await Month.findByPk(MonthID);
      if (!month) {
        throw new Error("month tidak ditemukan");
      }

      console.log(month, "ubah data month");
      await month.update({ ...data, UserID: UserID });
      return new MonthDto(month);
    } catch (error) {
      console.log("error mengubah data month", error);
      throw new Error("Gagal mengupdate month: " + error.message);
    }
  }

  async delete(MonthID) {
    try {
      const month = await Month.findByPk(MonthID);
      if (!month) {
        throw new Error("month tidak ditemukan");
      }

      await month.destroy();
      return { message: "month berhasil dihapus" };
    } catch (error) {
      throw new Error("Gagal menghapus month: " + error.message);
    }
  }
}

module.exports = new MonthRepository();
