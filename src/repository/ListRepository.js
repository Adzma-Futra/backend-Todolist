const List = require("../models/List");
const ListDto = require("../common/dto/ListDto");
const User = require("../models/User");
const { Op } = require("sequelize");

class ListRepository {
  async create(data, UserID) {
    try {
      // Cek apakah NamaList sudah ada
      const existingList = await List.findOne({
        where: { NamaList: data.NamaList },
      });
      if (existingList) {
        throw new Error("Nama list sudah ada, gunakan nama lain.");
      }

      // Jika NamaList belum ada, buat list baru
      const list = await List.create({ ...data, UserID: UserID });
      console.log(list, "berhasil membuat data list");
      return new ListDto(list);
    } catch (error) {
      throw new Error("Gagal membuat list: " + error.message);
    }
  }

  async getAll(dto) {
    try {
      const page = dto.page || 1;
      const per_page = dto.per_page || 30;
      const offset = (page - 1) * per_page;

      const whereClause = { 
        ...(dto.search && { NamaList: { [Op.like]: `%${dto.search}%` } }),
      };

      // Pengurutan hasil berdasarkan input orderBy
      let order = [["NamaList", "ASC"]];
      if (dto.orderBy === "terbaru") {
        order = [["TanggalList", "DESC"]];
      } else if (dto.orderBy === "terpopuler") {
        order = [["CreatedAt", "DESC"]];
      } else if (dto.orderBy === "terlama") {
        order = [["TanggalList", "ASC"]];
      }

      const ListData = await List.findAndCountAll({
        where: whereClause,
        limit: per_page,
        offset: offset,
        order: order,
        include: [{ model: User, attributes: ["Username", "Profile"] }],
      });

      return {
        List: ListData.rows.map((t) => {
          return new ListDto(t);
        }),
        totalItems: ListData.count,
        totalPage: Math.ceil(ListData.count / per_page),
        page: page,
        limit: per_page,
      };
    } catch (error) {
      console.error(error); // Print error ke konsol untuk debugging
      throw new Error("Gagal mendapatkan data list: " + error.message);
    }
  }

  async getById(ListID) {
    try {
      const list = await List.findByPk(ListID, {
        include: [
          { model: User, attributes: ["UserID", "Username", "Profile"] },
        ],
      });
      if (!list) {
        throw new Error("list tidak ditemukan");
      }

      return new ListDto(list);
    } catch (error) {
      throw new Error("Gagal mendapatkan data list: " + error.message);
    }
  }

  async getByIdUser(UserID) {
    try {
      const list = await List.findAll({
        where: { UserID: UserID },
        include: [
          { model: User, attributes: ["UserID", "Username", "Profile"] },
        ],
        order: [
          ["CreatedAt", "DESC"], // Mengurutkan berdasarkan createdAt secara menurun (terbaru)
        ],
      });
      console.log(list);
      return list.map((item) => {
        return new ListDto(item);
      });
    } catch (error) {
      throw new Error(
        "Gagal mendapatkan data list berdasarkan id user: " + error.message
      );
    }
  }

  async update(ListID, UserID, data) {
    try {
      const list = await List.findByPk(ListID);
      if (!list) {
        throw new Error("list tidak ditemukan");
      }

      console.log(list, "ubah data list");
      await list.update({ ...data, UserID: UserID });
      return new ListDto(list);
    } catch (error) {
      console.log("error mengubah data list", error);
      throw new Error("Gagal mengupdate list: " + error.message);
    }
  }

  async delete(ListID) {
    try {
      const list = await List.findByPk(ListID);
      if (!list) {
        throw new Error("list tidak ditemukan");
      }

      await list.destroy();
      return { message: "list berhasil dihapus" };
    } catch (error) {
      throw new Error("Gagal menghapus list: " + error.message);
    }
  }

  async findByName(NamaList) {
    try {
      const list = await List.findOne({
        where: {
          NamaList: NamaList, // pastikan nama kolom sesuai dengan yang ada di model
        },
      });
      return list;
    } catch (error) {
      throw new Error("Error saat mencari list: " + error.message);
    }
  }
}

module.exports = new ListRepository();
