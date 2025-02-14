const express = require("express");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");
const defaultBaseResponse = require("../common/baseResponse/defaultBaseResponse");
const TodayRepository = require("../repository/TodayRepository");
const authMiddleware = require("../middleware/authMiddleware");
const List = require("../models/List");
const ListRepository = require("../repository/ListRepository");

class TodayController {
  async create(req, res) {
    try {
      const { NamaList, Subtask, Task, Deskripsi } = req.body;
      const UserID = req.UserID;

      console.log(UserID, "ini id pengguna");
      console.log(req.body, "ini data foto");

      if (!NamaList) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(
            defaultBaseResponse(
              StatusCodes.BAD_REQUEST,
              false,
              "Nama list harus disediakan"
            )
          );
      }

      // Cari ListID berdasarkan NamaList
      let list = await List.findOne({ where: { NamaList } });

      // Jika list tidak ditemukan, buat list baru
      if (!list) {
        list = await List.create({
          NamaList,
          UserID, // Mengaitkan list dengan pengguna
        });
      }

      const data = {
        ListID: list.ListID, // Menggunakan listID dari list yang ditemukan/baru
        Subtask,
        Task,
        Deskripsi,
      };

      // Simpan data today ke database
      const today = await TodayRepository.create(data, UserID);
      console.log("Data yang diterima", today);

      return res
        .status(StatusCodes.CREATED)
        .json(
          defaultBaseResponse(
            StatusCodes.CREATED,
            true,
            "Berhasil membuat today",
            today
          )
        );
    } catch (error) {
      console.error("Error saat membuat today:", error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          defaultBaseResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            "Gagal membuat today baru: " + error.message
          )
        );
    }
  }

  async getAllToday(req, res) {
    try {
      //ekstrak query parameters dari req.query
      let {
        page = 1,
        per_page = 30,
        search = "",
        orderBy = "",
        tanggal = "",
        bulan = "",
        tahun = "",
      } = req.query;
      //konversi tanggal, bulan, dan tahun ke DTO
      const dto = {
        page,
        per_page,
        search,
        orderBy,
        tanggal,
        bulan,
        tahun,
      };

      // Panggil repository untuk mengambil daftar today berdasarkan DTO
      const todayList = await TodayRepository.getAllToday(dto);

      // Kirim respons berhasil dengan data today
      return res
        .status(StatusCodes.OK)
        .json(
          defaultBaseResponse(
            StatusCodes.OK,
            true,
            "Berhasil mendapatkan semua today",
            todayList
          )
        );
    } catch (error) {
      // Tangani kesalahan dan kirim respons gagal
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          defaultBaseResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            "Gagal mendapatkan data today: " + error.message
          )
        );
    }
  }

  async getById(req, res) {
    try {
      const { TodayID } = req.params;
      const today = await TodayRepository.getById(TodayID);
      if (!today) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json(
            defaultBaseResponse(
              StatusCodes.NOT_FOUND,
              false,
              "Id today tidak ditemukan"
            )
          );
      }

      return res
        .status(StatusCodes.OK)
        .json(
          defaultBaseResponse(
            StatusCodes.OK,
            true,
            "Berhasil mendapatkan data today berdasarkan id today",
            today
          )
        );
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          defaultBaseResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            "Gagal mendapatkan data today berdasarkan id today: " +
              error.message
          )
        );
    }
  }

  async getByIdUser(req, res) {
    try {
      //ekstrak query parameters dari req.query
      let {
        page = 1,
        per_page = 99,
        search = "",
        orderBy = "",
        tanggal = "",
        bulan = "",
        tahun = "",
      } = req.query;
      //konversi tanggal, bulan, dan tahun ke DTO
      const dto = {
        page,
        per_page,
        search,
        orderBy,
        tanggal,
        bulan,
        tahun,
      };

      const UserID = req.UserID;
      const today = await TodayRepository.getByIdUser(dto, UserID);

      if (!today || today.length === 0) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json(
            defaultBaseResponse(
              StatusCodes.NOT_FOUND,
              false,
              "Id user tidak ditemukan"
            )
          );
      }

      return res
        .status(StatusCodes.OK)
        .json(
          defaultBaseResponse(
            StatusCodes.OK,
            true,
            "Berhasil mengambil data today berdasarkan id user",
            today
          )
        );
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          defaultBaseResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            "Gagal mendapatkan data today: " + error.message
          )
        );
    }
  }

  async getByIdList(req, res) {
    try {
      const { ListID } = req.params;
      const today = await TodayRepository.getByIdList(ListID);

      if (!today || today.length === 0) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json(
            defaultBaseResponse(
              StatusCodes.NOT_FOUND,
              false,
              "Id list tidak ditemukan"
            )
          );
      }

      return res
        .status(StatusCodes.OK)
        .json(
          defaultBaseResponse(
            StatusCodes.OK,
            true,
            "Berhasil mengambil data today berdasarkan id list",
            today
          )
        );
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          defaultBaseResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            "Gagal mendapatkan data today: " + error.message
          )
        );
    }
  }

  async update(req, res) {
    try {
      const { TodayID } = req.params;
      const { NamaList, Subtask, Task, Deskripsi } = req.body;
      const UserID = req.UserID;
      console.log(UserID, "ini id pengguna");

      // Mencari today berdasarkan TodayID dan UserID
      const existingToday = await TodayRepository.getById(TodayID, UserID);
      if (!existingToday) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json(
            defaultBaseResponse(
              StatusCodes.NOT_FOUND,
              false,
              "Today tidak ditemukan"
            )
          );
      }

      // Mencari ListID berdasarkan NamaList
      const list = await ListRepository.findByName(NamaList);
      if (!list) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json(
            defaultBaseResponse(
              StatusCodes.NOT_FOUND,
              false,
              "list dengan nama tersebut tidak ditemukan"
            )
          );
      }

      // Memperbarui informasi today termasuk ListID baru
      const updatedToday = await TodayRepository.update(TodayID, UserID, {
        ListID: list.ListID, // Menggunakan ListID yang didapat dari NamaList
        Subtask,
        Task,
        Deskripsi,
      });

      console.log("ubah data today", updatedToday);
      return res
        .status(StatusCodes.OK)
        .json(
          defaultBaseResponse(
            StatusCodes.OK,
            true,
            "Berhasil mengubah data today dan memindahkannya ke list lain",
            updatedToday
          )
        );
    } catch (error) {
      console.error("error mengubah data", error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          defaultBaseResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            "Gagal memperbarui data today: " + error.message
          )
        );
    }
  }

  async delete(req, res) {
    try {
      const { TodayID } = req.params;
      const deleted = await TodayRepository.delete(TodayID);
      return res
        .status(StatusCodes.OK)
        .json(
          defaultBaseResponse(
            StatusCodes.OK,
            true,
            "Berhasil menghapus data today",
            deleted
          )
        );
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          defaultBaseResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            "Gagal menghapus today"
          )
        );
    }
  }

  async markTaskAsCompleted(req, res) {
    try {
      const { TodayID } = req.params;
      const updatedTask = await TodayRepository.markTaskAsCompleted(TodayID);

      return res
        .status(StatusCodes.OK)
        .json(
          defaultBaseResponse(
            StatusCodes.OK,
            true,
            "Task berhasil diselesaikan",
            updatedTask
          )
        );
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          defaultBaseResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            "Gagal menyelesaikan task: " + error.message
          )
        );
    }
  }

  async getUncompletedTasks(req, res) {
    try {
      const UserID = req.UserID;
      const tasks = await TodayRepository.getUncompletedTasks(UserID);

      return res
        .status(StatusCodes.OK)
        .json(
          defaultBaseResponse(
            StatusCodes.OK,
            true,
            "Berhasil mendapatkan daftar task yang belum selesai",
            tasks
          )
        );
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          defaultBaseResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            "Gagal mendapatkan task yang belum selesai: " + error.message
          )
        );
    }
  }
}

const todayController = new TodayController();

router.post(
  "/create",
  authMiddleware,
  todayController.create.bind(todayController)
);
router.get("/getAllToday", todayController.getAllToday.bind(todayController));
router.get("/getById/:TodayID", todayController.getById.bind(todayController));
router.get(
  "/getByIdUser",
  authMiddleware,
  todayController.getByIdUser.bind(todayController)
);
router.get(
  "/getByIdList/:ListID",
  todayController.getByIdList.bind(todayController)
);
router.put(
  "/update/:TodayID",
  authMiddleware,
  todayController.update.bind(todayController)
);
router.delete("/delete/:TodayID", todayController.delete.bind(todayController));
router.put(
  "/complete/:TodayID",
  authMiddleware,
  todayController.markTaskAsCompleted.bind(todayController)
);

router.get(
  "/uncompleted",
  authMiddleware,
  todayController.getUncompletedTasks.bind(todayController)
);


module.exports = router;
