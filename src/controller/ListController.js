const express = require("express");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");
const defaultBaseResponse = require("../common/baseResponse/defaultBaseResponse");
const ListRepository = require("../repository/ListRepository");
const authMiddleware = require("../middleware/authMiddleware");

class ListController {
  async create(req, res) {
    const { NamaList} = req.body;
    const UserID = req.UserID;
    console.log(UserID, "ini id pengguna");
    console.log(req.body, "ini data list");

    // Validasi input
    if (!NamaList === undefined) {
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
      // Panggil repository untuk membuat list
      const list = await ListRepository.create(req.body, UserID);
      console.log("Data yang diterima", list);

      return res
        .status(StatusCodes.CREATED)
        .json(
          defaultBaseResponse(
            StatusCodes.CREATED,
            true,
            "Berhasil membuat list",
            list
          )
        );
    } catch (error) {
      console.log(error);

      // Tangani error jika NamaList sudah ada
      if (error.message.includes("Nama list sudah ada")) {
        return res
          .status(StatusCodes.CONFLICT)
          .json(
            defaultBaseResponse(
              StatusCodes.CONFLICT,
              false,
              "Nama list sudah ada, gunakan nama lain."
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
            "Gagal Membuat list: " + error.message
          )
        );
    }
  }

  async getAll(req, res) {
    try {
      let { page = 1, search = "", per_page = 30, orderBy = "" } = req.query;
      const dto = { page, per_page, search, orderBy };
      const list = await ListRepository.getAll(dto);
      return res
        .status(StatusCodes.OK)
        .json(
          defaultBaseResponse(
            StatusCodes.OK,
            true,
            "Berhasil mendapatkan semua data list",
            list
          )
        );
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          defaultBaseResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            "Gagal mengambil semua data list baru" + error.message
          )
        );
    }
  }

  async getById(req, res) {
    try {
      const { ListID } = req.params;
      const list = await ListRepository.getById(ListID);

      if (!list) {
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
            "Berhasil mendapatkan data list dan user berdasarkan id list",
            list
          )
        );
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          defaultBaseResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            "Gagal mendapatkan data list: " + error.message
          )
        );
    }
  }

  async getByIdUser(req, res) {
    try {
      const UserID = req.UserID;
      const list = await ListRepository.getByIdUser(UserID);

      if (!list || list.length === 0) {
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
            "Berhasil mengambil data list berdasarkan id user",
            list
          )
        );
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          defaultBaseResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            "Gagal mendapatkan data list: " + error.message
          )
        );
    }
  }

  async update(req, res) {
    try {
      const { ListID } = req.params;
      const { NamaList, } = req.body;
      const UserID = req.UserID;
      console.log(UserID, "ini id pengguna");

      const list = await ListRepository.update(ListID, UserID, {
        NamaList,
      });

      if (!list) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json(
            defaultBaseResponse(
              StatusCodes.NOT_FOUND,
              false,
              "list tidak ditemukan"
            )
          );
      }

      console.log("ubah data list", list);
      return res
        .status(StatusCodes.OK)
        .json(
          defaultBaseResponse(
            StatusCodes.OK,
            true,
            "Berhasil mengubah data list",
            list
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
            "Gagal memperbarui data list: " + error.message
          )
        );
    }
  }

  async delete(req, res) {
    try {
      const { ListID } = req.params;
      const deleted = await ListRepository.delete(ListID);
      return res
        .status(StatusCodes.OK)
        .json(
          defaultBaseResponse(
            StatusCodes.OK,
            true,
            "Berhasil menghapus data list",
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
            "Gagal menghapus list"
          )
        );
    }
  }
}

const listController = new ListController();

//Router
router.post(
  "/create",
  authMiddleware,
  listController.create.bind(listController)
);
router.get("/getAll", listController.getAll.bind(listController));
router.get("/getById/:ListID", listController.getById.bind(listController));
router.get(
  "/getByIdUser/user",
  authMiddleware,
  listController.getByIdUser.bind(listController)
);
router.put(
  "/update/:ListID",
  authMiddleware,
  listController.update.bind(listController)
);
router.delete("/delete/:ListID", listController.delete.bind(listController));

module.exports = router;
