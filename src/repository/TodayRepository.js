const Today = require("../models/Today");
const User = require("../models/User");
const List = require("../models/List");
const TodayDto = require("../common/dto/TodayDto");
const { where } = require("sequelize");
const { Op } = require("sequelize");

class TodayRepository {
  async create(data, UserID) {
    try {
      const today = await Today.create({ ...data, UserID: UserID });
      console.log(today, "berhasil membuat data today");
      return new TodayDto(today);
    } catch (error) {
      throw new Error("Gagal membuat data today: " + error.message);
    }
  }

  async getAllToday(dto) {
    try {
      const page = dto.page || 1;
      const per_page = dto.per_page || 30;
      const offset = (page - 1) * per_page;

      // Membangun whereClause dasar untuk search dan DeskripsiFoto
      const whereClause = {
        ...(dto.search && { Subtask: { [Op.like]: `%${dto.search}%` } }),
      };

      // Filter berdasarkan tanggal, bulan, dan tahun jika tersedia
      if (dto.tanggal || dto.bulan || dto.tahun) {
        const startDate = new Date(
          dto.tahun || 1970,
          dto.bulan ? dto.bulan - 1 : 0,
          dto.tanggal || 1
        );
        const endDate = new Date(
          dto.tahun || 9999,
          dto.bulan ? dto.bulan - 1 : 11,
          dto.tanggal || 31,
          23,
          59,
          59
        );

        whereClause.TanggalTask = {
          [Op.and]: [{ [Op.gte]: startDate }, { [Op.lte]: endDate }],
        };
      }

      // Pengurutan hasil berdasarkan input orderBy
      let order = [["Subtask", "ASC"]];
      if (dto.orderBy === "terbaru") {
        order = [["TanggalTask", "DESC"]];
      } else if (dto.orderBy === "terpopuler") {
        order = [["TodayID", "DESC"]];
      } else if (dto.orderBy === "terlama") {
        order = [["TanggalTask", "ASC"]];
      }

      const today = await Today.findAndCountAll({
        where: whereClause,
        limit: per_page,
        offset: offset,
        order: order,
        include: [
          { model: User, attributes: ["UserID", "Username", "Profile"] },
          { model: List, attributes: ["ListID", "NamaList"] },
        ],
      });

      return {
        List: today.rows.map((today) => {
          return new TodayDto(today);
        }),
        totalItems: today.count,
        totalPage: Math.ceil(today.count / per_page),
        page: page,
        limit: per_page,
      };
    } catch (error) {
      throw new Error(
        "Gagal mengambil data today dengan pagination dan search: " +
          error.message
      );
    }
  }

  async getById(TodayID) {
    try {
      const today = await Today.findByPk(TodayID, {
        include: [
          { model: User, attributes: ["UserID", "Username", "Profile"] },
          { model: List, attributes: ["ListID", "NamaList"] },
        ],
      });

      if (!today) {
        throw new Error("today tidak ditemukan");
      }

      return new TodayDto(today);
    } catch (error) {
      throw new Error("Kesalahan saat mengambil data today: " + error.message);
    }
  }

  async getByIdUser(dto, UserID) {
    try {
      const page = dto.page || 1;
      const per_page = dto.per_page || 99;
      const offset = (page - 1) * per_page;

      // Membangun whereClause dasar untuk search dan DeskripsiFoto
      const whereClause = {
        ...(dto.search && { Subtask: { [Op.like]: `%${dto.search}%` } }),
      };

      // Filter berdasarkan tanggal, bulan, dan tahun jika tersedia
      if (dto.tanggal || dto.bulan || dto.tahun) {
        const startDate = new Date(
          dto.tahun || 1970,
          dto.bulan ? dto.bulan - 1 : 0,
          dto.tanggal || 1
        );
        const endDate = new Date(
          dto.tahun || 9999,
          dto.bulan ? dto.bulan - 1 : 11,
          dto.tanggal || 31,
          23,
          59,
          59
        );

        whereClause.TanggalTask = {
          [Op.and]: [{ [Op.gte]: startDate }, { [Op.lte]: endDate }],
        };
      }

      // Pengurutan hasil berdasarkan input orderBy
      let order = [["CreatedAt", "DESC"]];
      if (dto.orderBy === "terbaru") {
        order = [["TanggalTask", "DESC"]];
      } else if (dto.orderBy === "terpopuler") {
        order = [["TodayID", "DESC"]];
      } else if (dto.orderBy === "terlama") {
        order = [["TanggalTask", "ASC"]];
      }

      const today = await Today.findAndCountAll({
        where: { UserID: UserID },
        where: whereClause,
        limit: per_page,
        offset: offset,
        order: order,
        include: [
          { model: User, attributes: ["UserID", "Username", "Profile"] },
          { model: List, attributes: ["ListID", "NamaList"] },
        ],
      });
      console.log(today);
      return {
        List: today.rows.map((today) => {
          return new TodayDto(today);
        }),
        totalItems: today.count,
        totalPage: Math.ceil(today.count / per_page),
        page: page,
        limit: per_page,
      };
    } catch (error) {
      throw new Error(
        "Gagal mendapatkan data today berdasarkan id user: " + error.message
      );
    }
  }

  async getByIdList(ListID) {
    try {
      const today = await Today.findAll({
        where: { ListID: ListID },
        include: [
          { model: User, attributes: ["UserID", "Username", "Profile"] },
          { model: List, attributes: ["ListID", "NamaList"] },
        ],
      });
      console.log(today);
      return today.map((item) => {
        return new TodayDto(item);
      });
    } catch (error) {
      throw new Error(
        "Gagal mendapatkan data today berdasarkan id list: " + error.message
      );
    }
  }

  async update(TodayID, UserID, data) {
    try {
      const today = await Today.findByPk(TodayID);
      if (!today) throw new Error("today tidak ditemukan");

      console.log(today, "ubah data today");
      await today.update({ ...data, UserID: UserID }); // Update data lainnya
      return new TodayDto(today);
    } catch (error) {
      console.log("error mengubah data today", error);
      throw new Error("Gagal mengupdate today: " + error.message);
    }
  }

  async delete(TodayID) {
    try {
      const today = await Today.findByPk(TodayID);
      if (!today) {
        throw new Error("today tidak ditemukan");
      }

      await today.destroy();
      return { message: "today berhasil dihapus" };
    } catch (error) {
      throw new Error("Gagal menghapus today: " + error.message);
    }
  }

  async markTaskAsCompleted(TodayID) {
    try {
      const today = await Today.findByPk(TodayID);
      if (!today) {
        throw new Error("Task tidak ditemukan");
      }

      today.IsCompleted = "selesai";
      today.CompletedAt = new Date();

      await today.save();
      return new TodayDto(today);
    } catch (error) {
      throw new Error("Gagal menyelesaikan task: " + error.message);
    }
  }

  async getUncompletedTasks(UserID) {
    try {
      const today = await Today.findAll({
        where: {
          UserID: UserID,
          IsCompleted: { [Op.or]: [null, 0] },
        },
        include: [
          { model: User, attributes: ["UserID", "Username", "Profile"] },
          { model: List, attributes: ["ListID", "NamaList"] },
        ],
      });

      return today.map((task) => new TodayDto(task));
    } catch (error) {
      throw new Error(
        "Gagal mendapatkan daftar task yang belum selesai: " + error.message
      );
    }
  }
}

module.exports = new TodayRepository();
