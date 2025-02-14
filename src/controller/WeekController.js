const express = require("express");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");
const defaultBaseResponse = require("../common/baseResponse/defaultBaseResponse");
const WeekRepository = require("../repository/WeekRepository");
const authMiddleware = require("../middleware/authMiddleware");

class WeekController {
  async create(req, res) {
    const { EventTitleWeek, Hari, Deskripsi } = req.body;
    const UserID = req.UserID;
    console.log(UserID, "ini id pengguna");
    console.log(req.body, "ini data day");

    // Validasi input
    if (!EventTitleWeek || !Hari || !Deskripsi) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          defaultBaseResponse(
            StatusCodes.BAD_REQUEST,
            false,
            "Semua field harus diisi"
          )
        );
    }

    try {
      // Panggil repository untuk membuat week
      const week = await WeekRepository.create(
              { EventTitleWeek, Hari, Deskripsi },
              UserID
            );
      console.log("Data yang diterima", week);

      return res
        .status(StatusCodes.CREATED)
        .json(
          defaultBaseResponse(
            StatusCodes.CREATED,
            true,
            "Berhasil membuat week",
            week
          )
        );
    } catch (error) {
      console.log(error);

      // Tangani error jika Namaweek sudah ada
      if (error.message.includes("EventTitleWeek sudah ada")) {
        return res
          .status(StatusCodes.CONFLICT)
          .json(
            defaultBaseResponse(
              StatusCodes.CONFLICT,
              false,
              "EventTitleWeek sudah ada, gunakan nama lain."
            )
          );
      }

      // Tangani error lain
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          defaultBaseResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            "Gagal Membuat week: " + error.message
          )
        );
    }
  }

  async getAll(req, res) {
    try {
      let { page = 1, search = "", per_page = 30, orderBy = "" } = req.query;
      const dto = { page, per_page, search, orderBy };
      const week = await WeekRepository.getAll(dto);
      return res
        .status(StatusCodes.OK)
        .json(
          defaultBaseResponse(
            StatusCodes.OK,
            true,
            "Berhasil mendapatkan semua data week",
            week
          )
        );
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          defaultBaseResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            "Gagal mengambil semua data week baru" + error.message
          )
        );
    }
  }

  async getById(req, res) {
    try {
      const { WeekID } = req.params;
      const week = await WeekRepository.getById(WeekID);

      if (!week) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json(
            defaultBaseResponse(
              StatusCodes.NOT_FOUND,
              false,
              "Id week tidak ditemukan"
            )
          );
      }

      return res
        .status(StatusCodes.OK)
        .json(
          defaultBaseResponse(
            StatusCodes.OK,
            true,
            "Berhasil mendapatkan data week dan user berdasarkan id week",
            week
          )
        );
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          defaultBaseResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            "Gagal mendapatkan data week: " + error.message
          )
        );
    }
  }

  async getByIdUser(req, res) {
    try {
      const UserID = req.UserID;
      const week = await WeekRepository.getByIdUser(UserID);

      if (!week || week.length === 0) {
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
            "Berhasil mengambil data week berdasarkan id user",
            week
          )
        );
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          defaultBaseResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            "Gagal mendapatkan data week: " + error.message
          )
        );
    }
  }

  async update(req, res) {
    try {
      const { WeekID } = req.params;
      const { EventTitleWeek, Hari, Deskripsi } = req.body;
      const UserID = req.UserID;
      console.log(UserID, "ini id pengguna");

      const week = await WeekRepository.update(WeekID, UserID, {
        EventTitleWeek,
        Hari,
        Deskripsi,
      });

      if (!week) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json(
            defaultBaseResponse(
              StatusCodes.NOT_FOUND,
              false,
              "week tidak ditemukan"
            )
          );
      }

      console.log("ubah data week", week);
      return res
        .status(StatusCodes.OK)
        .json(
          defaultBaseResponse(
            StatusCodes.OK,
            true,
            "Berhasil mengubah data week",
            week
          )
        );
    } catch (error) {
      console.log("error mengubah data", error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          defaultBaseResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            "Gagal memperbarui data week: " + error.message
          )
        );
    }
  }

  async delete(req, res) {
    try {
      const { WeekID } = req.params;
      const deleted = await WeekRepository.delete(WeekID);
      return res
        .status(StatusCodes.OK)
        .json(
          defaultBaseResponse(
            StatusCodes.OK,
            true,
            "Berhasil menghapus data week",
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
            "Gagal menghapus week"
          )
        );
    }
  }
}

const weekController = new WeekController();

//Router
router.post(
  "/create",
  authMiddleware,
  weekController.create.bind(weekController)
);
router.get("/getAll", weekController.getAll.bind(weekController));
router.get("/getById/:WeekID", weekController.getById.bind(weekController));
router.get(
  "/getByIdUser/user",
  authMiddleware,
  weekController.getByIdUser.bind(weekController)
);
router.put(
  "/update/:WeekID",
  authMiddleware,
  weekController.update.bind(weekController)
);
router.delete("/delete/:WeekID", weekController.delete.bind(weekController));

module.exports = router;
