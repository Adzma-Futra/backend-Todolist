const express = require("express");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");
const defaultBaseResponse = require("../common/baseResponse/defaultBaseResponse");
const MonthRepository = require("../repository/MonthRepository");
const authMiddleware = require("../middleware/authMiddleware");

class MonthController {
  async create(req, res) {
    const { EventTitleMonth, Week, Deskripsi } = req.body;
    const UserID = req.UserID;
    console.log(UserID, "ini id pengguna");
    console.log(req.body, "ini data day");

    // Validasi input
    if (!EventTitleMonth || !Week || !Deskripsi) {
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
      // Panggil repository untuk membuat month
      const month = await MonthRepository.create(req.body, UserID);
      console.log("Data yang diterima", month);

      return res
        .status(StatusCodes.CREATED)
        .json(
          defaultBaseResponse(
            StatusCodes.CREATED,
            true,
            "Berhasil membuat month",
            month
          )
        );
    } catch (error) {
      console.log(error);

      // Tangani error jika Namamonth sudah ada
      if (error.message.includes("EventTitleMonth sudah ada")) {
        return res
          .status(StatusCodes.CONFLICT)
          .json(
            defaultBaseResponse(
              StatusCodes.CONFLICT,
              false,
              "EventTitleMonth sudah ada, gunakan nama lain."
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
            "Gagal Membuat month: " + error.message
          )
        );
    }
  }

  async getAll(req, res) {
    try {
      let { page = 1, search = "", per_page = 30, orderBy = "" } = req.query;
      const dto = { page, per_page, search, orderBy };
      const month = await MonthRepository.getAll(dto);
      return res
        .status(StatusCodes.OK)
        .json(
          defaultBaseResponse(
            StatusCodes.OK,
            true,
            "Berhasil mendapatkan semua data month",
            month
          )
        );
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          defaultBaseResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            "Gagal mengambil semua data month baru" + error.message
          )
        );
    }
  }

  async getById(req, res) {
    try {
      const { MonthID } = req.params;
      const month = await MonthRepository.getById(MonthID);

      if (!month) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json(
            defaultBaseResponse(
              StatusCodes.NOT_FOUND,
              false,
              "Id month tidak ditemukan"
            )
          );
      }

      return res
        .status(StatusCodes.OK)
        .json(
          defaultBaseResponse(
            StatusCodes.OK,
            true,
            "Berhasil mendapatkan data month dan user berdasarkan id month",
            month
          )
        );
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          defaultBaseResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            "Gagal mendapatkan data month: " + error.message
          )
        );
    }
  }

  async getByIdUser(req, res) {
    try {
      const UserID = req.UserID;
      const month = await MonthRepository.getByIdUser(UserID);

      if (!month || month.length === 0) {
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
            "Berhasil mengambil data month berdasarkan id user",
            month
          )
        );
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          defaultBaseResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            "Gagal mendapatkan data month: " + error.message
          )
        );
    }
  }

  async update(req, res) {
    try {
      const { MonthID } = req.params;
      const { EventTitleMonth, Week, Deskripsi } = req.body;
      const UserID = req.UserID;
      console.log(UserID, "ini id pengguna");

      const month = await MonthRepository.update(MonthID, UserID, {
        EventTitleMonth,
        Week,
        Deskripsi,
      });

      if (!month) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json(
            defaultBaseResponse(
              StatusCodes.NOT_FOUND,
              false,
              "month tidak ditemukan"
            )
          );
      }

      console.log("ubah data month", month);
      return res
        .status(StatusCodes.OK)
        .json(
          defaultBaseResponse(
            StatusCodes.OK,
            true,
            "Berhasil mengubah data month",
            month
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
            "Gagal memperbarui data month: " + error.message
          )
        );
    }
  }

  async delete(req, res) {
    try {
      const { MonthID } = req.params;
      const deleted = await MonthRepository.delete(MonthID);
      return res
        .status(StatusCodes.OK)
        .json(
          defaultBaseResponse(
            StatusCodes.OK,
            true,
            "Berhasil menghapus data month",
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
            "Gagal menghapus month"
          )
        );
    }
  }
}

const monthController = new MonthController();

//Router
router.post(
  "/create",
  authMiddleware,
  monthController.create.bind(monthController)
);
router.get("/getAll", monthController.getAll.bind(monthController));
router.get("/getById/:MonthID", monthController.getById.bind(monthController));
router.get(
  "/getByIdUser/user",
  authMiddleware,
  monthController.getByIdUser.bind(monthController)
);
router.put(
  "/update/:MonthID",
  authMiddleware,
  monthController.update.bind(monthController)
);
router.delete("/delete/:MonthID", monthController.delete.bind(monthController));

module.exports = router;
