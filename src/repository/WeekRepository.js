const Week = require("../models/Week");
const WeekDto = require("../common/dto/WeekDto");
const User = require("../models/User");
const { Op } = require("sequelize");

class WeekRepository {
  async create(data, UserID) {
    try {
      const allowedHari = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]; // Metode pembayaran yang diizinkan

      // Cek metode pembayaran
      if (!allowedHari.includes(data.Hari)) {
        throw new Error("Hari tidak valid");
      }

      // Cek apakah EventTitleWeek sudah ada
      const existingWeek = await Week.findOne({
        where: { EventTitleWeek: data.EventTitleWeek },
      });
      if (existingWeek) {
        throw new Error("Event Week sudah ada, gunakan nama lain.");
      }

      // Jika EventTitleWeek belum ada, buat Week baru
      const week = await Week.create({ ...data, UserID: UserID });
      console.log(week, "berhasil membuat data week");
      return new WeekDto(week);
    } catch (error) {
      throw new Error("Gagal membuat week: " + error.message);
    }
  }

  async getAll(dto) {
    try {
      const page = dto.page || 1;
      const per_page = dto.per_page || 30;
      const offset = (page - 1) * per_page;

      const whereClause = {
        ...(dto.search && { EventTitleWeek: { [Op.like]: `%${dto.search}%` } }),
      };

      // Pengurutan hasil berdasarkan input orderBy
      let order = [["CreatedAt", "DESC"]];

      const WeekData = await Week.findAndCountAll({
        where: whereClause,
        limit: per_page,
        offset: offset,
        order: order,
        include: [{ model: User, attributes: ["Username", "Profile"] }],
      });

      return {
        List: WeekData.rows.map((t) => {
          return new WeekDto(t);
        }),
        totalItems: WeekData.count,
        totalPage: Math.ceil(WeekData.count / per_page),
        page: page,
        limit: per_page,
      };
    } catch (error) {
      console.error(error); // Print error ke konsol untuk debugging
      throw new Error("Gagal mendapatkan data week: " + error.message);
    }
  }

  async getById(WeekID) {
    try {
      const week = await Week.findByPk(WeekID, {
        include: [
          { model: User, attributes: ["UserID", "Username", "Profile"] },
        ],
      });
      if (!week) {
        throw new Error("week tidak ditemukan");
      }

      return new WeekDto(week);
    } catch (error) {
      throw new Error("Gagal mendapatkan data week: " + error.message);
    }
  }

  async getByIdUser(UserID) {
    try {
      const week = await Week.findAll({
        where: { UserID: UserID },
        include: [
          { model: User, attributes: ["UserID", "Username", "Profile"] },
        ],
        order: [
          ["CreatedAt", "DESC"], // Mengurutkan berdasarkan createdAt secara menurun (terbaru)
        ],
      });
      console.log(week);
      return week.map((item) => {
        return new WeekDto(item);
      });
    } catch (error) {
      throw new Error(
        "Gagal mendapatkan data week berdasarkan id user: " + error.message
      );
    }
  }

  async update(WeekID, UserID, data) {
    try {
      const allowedHari = [
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu",
        "Minggu",
      ]; // Metode pembayaran yang diizinkan

      // Cek metode pembayaran
      if (!allowedHari.includes(data.Hari)) {
        throw new Error("Hari tidak valid");
      }
      
      const week = await Week.findByPk(WeekID);
      if (!week) {
        throw new Error("week tidak ditemukan");
      }

      console.log(week, "ubah data week");
      await week.update({ ...data, UserID: UserID });
      return new WeekDto(week);
    } catch (error) {
      console.log("error mengubah data week", error);
      throw new Error("Gagal mengupdate week: " + error.message);
    }
  }

  async delete(WeekID) {
    try {
      const week = await Week.findByPk(WeekID);
      if (!week) {
        throw new Error("week tidak ditemukan");
      }

      await week.destroy();
      return { message: "week berhasil dihapus" };
    } catch (error) {
      throw new Error("Gagal menghapus week: " + error.message);
    }
  }
}

module.exports = new WeekRepository();
