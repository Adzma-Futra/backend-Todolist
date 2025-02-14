const Day = require("../models/Day");
const DayDto = require("../common/dto/DayDto");
const User = require("../models/User");
const { Op } = require("sequelize");

class DayRepository {
  async create(data, UserID) {
    try {
      // Cek apakah EventTitleDay sudah ada
      const existingList = await Day.findOne({
        where: { EventTitleDay: data.EventTitleDay },
      });
      if (existingList) {
        throw new Error("Event Day sudah ada, gunakan nama lain.");
      }

      // Jika EventTitleDay belum ada, buat day baru
      const day = await Day.create({ ...data, UserID: UserID });
      console.log(day, "berhasil membuat data day");
      return new DayDto(day);
    } catch (error) {
      throw new Error("Gagal membuat day: " + error.message);
    }
  }

  async getAll(dto) {
    try {
      const page = dto.page || 1;
      const per_page = dto.per_page || 30;
      const offset = (page - 1) * per_page;

      const whereClause = {
        ...(dto.search && { EventTitleDay: { [Op.like]: `%${dto.search}%` } }),
      };

      // Pengurutan hasil berdasarkan input orderBy
      let order = [["CreatedAt", "DESC"]];

      const Daydata = await Day.findAndCountAll({
        where: whereClause,
        limit: per_page,
        offset: offset,
        order: order,
        include: [{ model: User, attributes: ["Username", "Profile"] }],
      });

      return {
        List: Daydata.rows.map((t) => {
          return new DayDto(t);
        }),
        totalItems: Daydata.count,
        totalPage: Math.ceil(Daydata.count / per_page),
        page: page,
        limit: per_page,
      };
    } catch (error) {
      console.error(error); // Print error ke konsol untuk debugging
      throw new Error("Gagal mendapatkan data day: " + error.message);
    }
  }

  async getById(DayID) {
    try {
      const day = await Day.findByPk(DayID, {
        include: [
          { model: User, attributes: ["UserID", "Username", "Profile"] },
        ],
      });
      if (!day) {
        throw new Error("day tidak ditemukan");
      }

      return new DayDto(day);
    } catch (error) {
      throw new Error("Gagal mendapatkan data day: " + error.message);
    }
  }

  async getByIdUser(UserID) {
    try {
      const day = await Day.findAll({
        where: { UserID: UserID },
        include: [
          { model: User, attributes: ["UserID", "Username", "Profile"] },
        ],
        order: [
          ["CreatedAt", "DESC"], // Mengurutkan berdasarkan createdAt secara menurun (terbaru)
        ],
      });
      console.log(day);
      return day.map((item) => {
        return new DayDto(item);
      });
    } catch (error) {
      throw new Error(
        "Gagal mendapatkan data day berdasarkan id user: " + error.message
      );
    }
  }

  async update(DayID, UserID, data) {
    try {
      const day = await Day.findByPk(DayID);
      if (!day) {
        throw new Error("day tidak ditemukan");
      }

      console.log(day, "ubah data day");
      await day.update({ ...data, UserID: UserID });
      return new DayDto(day);
    } catch (error) {
      console.log("error mengubah data day", error);
      throw new Error("Gagal mengupdate day: " + error.message);
    }
  }

  async delete(DayID) {
    try {
      const day = await Day.findByPk(DayID);
      if (!day) {
        throw new Error("day tidak ditemukan");
      }

      await day.destroy();
      return { message: "day berhasil dihapus" };
    } catch (error) {
      throw new Error("Gagal menghapus day: " + error.message);
    }
  }
}

module.exports = new DayRepository();
