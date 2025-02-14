const express = require("express");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");
const defaultBaseResponse = require("../common/baseResponse/defaultBaseResponse");
const DayRepository = require("../repository/DayRepository");
const authMiddleware = require("../middleware/authMiddleware");

class DayController {
  async create(req, res) {
    const { EventTitleDay, StartTime, EndTime, Deskripsi } = req.body;
    const UserID = req.UserID;
    console.log(UserID, "ini id pengguna");

    // Validasi input
    if (!EventTitleDay || !StartTime || !EndTime || !Deskripsi) {
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

    // Validasi format waktu (HH:MM:SS)
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    if (!timeRegex.test(StartTime) || !timeRegex.test(EndTime)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          defaultBaseResponse(
            StatusCodes.BAD_REQUEST,
            false,
            "Format waktu harus HH:MM:SS"
          )
        );
    }

    // Gabungkan waktu menjadi format "14:00:00-15:00:00"
    const Time = `${StartTime}-${EndTime}`;

    try {
      // Panggil repository untuk membuat day
      const day = await DayRepository.create(
        { EventTitleDay, Time, Deskripsi },
        UserID
      );
      console.log("Data yang diterima", day);

      return res
        .status(StatusCodes.CREATED)
        .json(
          defaultBaseResponse(
            StatusCodes.CREATED,
            true,
            "Berhasil membuat day",
            day
          )
        );
    } catch (error) {
      console.log(error);

      if (error.message.includes("EventTitleDay sudah ada")) {
        return res
          .status(StatusCodes.CONFLICT)
          .json(
            defaultBaseResponse(
              StatusCodes.CONFLICT,
              false,
              "EventTitleDay sudah ada, gunakan nama lain."
            )
          );
      }

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          defaultBaseResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            "Gagal Membuat day: " + error.message
          )
        );
    }
  }

  async getAll(req, res) {
    try {
      let { page = 1, search = "", per_page = 30, orderBy = "" } = req.query;
      const dto = { page, per_page, search, orderBy };
      const day = await DayRepository.getAll(dto);
      return res
        .status(StatusCodes.OK)
        .json(
          defaultBaseResponse(
            StatusCodes.OK,
            true,
            "Berhasil mendapatkan semua data day",
            day
          )
        );
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          defaultBaseResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            "Gagal mengambil semua data day baru" + error.message
          )
        );
    }
  }

  async getById(req, res) {
    try {
      const { DayID } = req.params;
      const day = await DayRepository.getById(DayID);

      if (!day) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json(
            defaultBaseResponse(
              StatusCodes.NOT_FOUND,
              false,
              "Id day tidak ditemukan"
            )
          );
      }

      return res
        .status(StatusCodes.OK)
        .json(
          defaultBaseResponse(
            StatusCodes.OK,
            true,
            "Berhasil mendapatkan data day dan user berdasarkan id day",
            day
          )
        );
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          defaultBaseResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            "Gagal mendapatkan data day: " + error.message
          )
        );
    }
  }

  async getByIdUser(req, res) {
    try {
      const UserID = req.UserID;
      const day = await DayRepository.getByIdUser(UserID);

      if (!day || day.length === 0) {
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
            "Berhasil mengambil data day berdasarkan id user",
            day
          )
        );
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          defaultBaseResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            "Gagal mendapatkan data day: " + error.message
          )
        );
    }
  }

  async update(req, res) {
    try {
      const { DayID } = req.params;
      const { EventTitleDay, StartTime, EndTime, Deskripsi } = req.body;
      const UserID = req.UserID;
      console.log(UserID, "ini id pengguna");

      // Validasi input: Semua field harus diisi
      if (!EventTitleDay || !StartTime || !EndTime || !Deskripsi) {
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

      // Validasi format StartTime dan EndTime (HH:MM:SS)
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
      if (!timeRegex.test(StartTime) || !timeRegex.test(EndTime)) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(
            defaultBaseResponse(
              StatusCodes.BAD_REQUEST,
              false,
              "Format waktu tidak valid. Gunakan format HH:MM:SS"
            )
          );
      }

      // Gabungkan StartTime dan EndTime menjadi satu string
      const Time = `${StartTime}-${EndTime}`;

      // Cek apakah DayID ada di database
      const existingDay = await DayRepository.getById(DayID, UserID);
      if (!existingDay) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json(
            defaultBaseResponse(
              StatusCodes.NOT_FOUND,
              false,
              "Day tidak ditemukan"
            )
          );
      }

      // Update data
      const updatedDay = await DayRepository.update(DayID, UserID, {
        EventTitleDay,
        Time, // Sudah dalam format "HH:MM:SS-HH:MM:SS"
        Deskripsi,
      });

      console.log("ubah data day", updatedDay);
      return res
        .status(StatusCodes.OK)
        .json(
          defaultBaseResponse(
            StatusCodes.OK,
            true,
            "Berhasil mengubah data day",
            updatedDay
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
            "Gagal memperbarui data day: " + error.message
          )
        );
    }
  }

  async delete(req, res) {
    try {
      const { DayID } = req.params;
      const deleted = await DayRepository.delete(DayID);
      return res
        .status(StatusCodes.OK)
        .json(
          defaultBaseResponse(
            StatusCodes.OK,
            true,
            "Berhasil menghapus data day",
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
            "Gagal menghapus day"
          )
        );
    }
  }
}

const dayController = new DayController();

//Router
router.post(
  "/create",
  authMiddleware,
  dayController.create.bind(dayController)
);
router.get("/getAll", dayController.getAll.bind(dayController));
router.get("/getById/:DayID", dayController.getById.bind(dayController));
router.get(
  "/getByIdUser/user",
  authMiddleware,
  dayController.getByIdUser.bind(dayController)
);
router.put(
  "/update/:DayID",
  authMiddleware,
  dayController.update.bind(dayController)
);
router.delete("/delete/:DayID", dayController.delete.bind(dayController));

module.exports = router;
