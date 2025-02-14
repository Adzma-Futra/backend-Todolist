const express = require("express");
const router = express.Router();
const UserRepository = require("../repository/UserRepository");
const baseResponse = require("../common/baseResponse/defaultBaseResponse");
const { StatusCodes } = require("http-status-codes");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/multerMiddleware");

class UserController {
  async createUser(req, res) {
    try {
      const existingUser = await UserRepository.getUserByEmail(req.body.Email);
      if (existingUser) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(
            baseResponse(
              StatusCodes.BAD_REQUEST,
              false,
              "Email sudah digunakan"
            )
          );
      }

      const newUser = await UserRepository.createUser(req.body);
      return res
        .status(StatusCodes.CREATED)
        .json(
          baseResponse(
            StatusCodes.CREATED,
            true,
            "Pengguna berhasil dibuat",
            newUser
          )
        );
    } catch (error) {
      console.error("Error saat membuat pengguna:", error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          baseResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            "Terjadi kesalahan saat membuat pengguna"
          )
        );
    }
  }

  async createProfile(req, res) {
    try {
      const Profile = req.file ? req.file.filename : null;
      const UserID = req.UserID;

      console.log(UserID);
      if (!req.file) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(
            baseResponse(
              StatusCodes.BAD_REQUEST,
              false,
              "url gambar harus disediakan"
            )
          );
      }

      const data = {
        Profile,
      };
      const profileUser = await UserRepository.updateUser(data, UserID);
      return res
        .status(StatusCodes.CREATED)
        .json(
          baseResponse(
            StatusCodes.CREATED,
            true,
            "profile berhasil dibuat",
            profileUser
          )
        );
    } catch (error) {
      console.error("Error saat membuat konser:", error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          baseResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            "Gagal membuat profile baru: " + error.message
          )
        );
    }
  }

  async getAllUser(req, res) {
    try {
      let { page = 1, search = "", per_page = 20 } = req.query;
      const dto = { page, per_page, search };
      const users = await UserRepository.getAllUser(dto);

      return res
        .status(StatusCodes.OK)
        .json(
          baseResponse(
            StatusCodes.OK,
            true,
            "Data pengguna berhasil diambil",
            users
          )
        );
    } catch (error) {
      console.error("Error saat mendapatkan semua pengguna:", error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          baseResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            "Terjadi kesalahan saat mendapatkan pengguna"
          )
        );
    }
  }

  async getDetailUser(req, res) {
    try {
      const user = await UserRepository.getUserById(req.UserID);
      if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json(
            baseResponse(
              StatusCodes.NOT_FOUND,
              false,
              "Pengguna tidak ditemukan"
            )
          );
      }

      console.log(user);
      return res
        .status(StatusCodes.OK)
        .json(
          baseResponse(
            StatusCodes.OK,
            true,
            "Detail pengguna berhasil diambil",
            user
          )
        );
    } catch (error) {
      console.error("Error saat mengambil detail pengguna:", error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          baseResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            "Terjadi kesalahan saat mengambil detail pengguna"
          )
        );
    }
  }

  async getProfileUser(req, res) {
    const user = await UserRepository.getUserById(req.UserID);
    if (user === null) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(
          baseResponse(
            StatusCodes.NOT_FOUND,
            false,
            "Data User tidak ditemukan"
          )
        );
    }
    res
      .status(StatusCodes.OK)
      .json(
        baseResponse(
          StatusCodes.OK,
          true,
          "Data User berhasil didapatkan",
          user
        )
      );
  }

  async updateUser(req, res) {
    try {
      const UserID = req.UserID;
      console.log(UserID, "ini id pengguna");

      const { Username, Email } = req.body;
      let Profile = null;

      // Jika ada file yang diunggah, gunakan nama file baru
      if (req.file) {
        Profile = req.file.filename;
      }

      // Ambil data pengguna saat ini dari database
      const existingUser = await UserRepository.getUserById(UserID);
      if (!existingUser) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json(
            baseResponse(
              StatusCodes.NOT_FOUND,
              false,
              "Pengguna tidak ditemukan"
            )
          );
      }

      // Jika tidak ada file baru, gunakan Profile lama
      const updatedData = {
        Username,
        Email,
        Profile: Profile || existingUser.Profile, // Gunakan profile lama jika tidak ada file baru
      };

      // Update pengguna di database
      const updatedUser = await UserRepository.updateUser(UserID, updatedData);

      return res
        .status(StatusCodes.OK)
        .json(
          baseResponse(
            StatusCodes.OK,
            true,
            "Pengguna berhasil diperbarui",
            updatedUser
          )
        );
    } catch (error) {
      console.error("Error saat memperbarui pengguna:", error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          baseResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            "Terjadi kesalahan saat memperbarui pengguna"
          )
        );
    }
  }

  async deleteUser(req, res) {
    try {
      await UserRepository.deleteUser(req.params.id);
      return res
        .status(StatusCodes.OK)
        .json(baseResponse(StatusCodes.OK, true, "Pengguna berhasil dihapus"));
    } catch (error) {
      console.error("Error saat menghapus pengguna:", error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          baseResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            "Terjadi kesalahan saat menghapus pengguna"
          )
        );
    }
  }

  async updatePassword(req, res) {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          baseResponse(
            StatusCodes.BAD_REQUEST,
            false,
            "oldPassword, newPassword, dan confirmNewPassword harus diisi"
          )
        );
    }

    if (newPassword !== confirmNewPassword) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          baseResponse(
            StatusCodes.BAD_REQUEST,
            false,
            "Kata sandi baru dan konfirmasi kata sandi tidak cocok"
          )
        );
    }

    try {
      const result = await UserRepository.updatePassword(
        req.UserID,
        oldPassword,
        newPassword
      );

      console.log(result, "data password");
      return res
        .status(StatusCodes.OK)
        .json(
          baseResponse(
            StatusCodes.OK,
            true,
            "berhasil memperbarui kata sandi",
            result
          )
        );
    } catch (error) {
      console.error("Error saat mengubah kata sandi:", error);
      console.log(error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          baseResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            false,
            "Terjadi kesalahan saat mengubah kata sandi"
          )
        );
    }
  }
}

const userController = new UserController();

router.post(
  "/profile",
  upload.single("Profile"),
  authMiddleware,
  userController.createProfile.bind(userController)
);
router.post(
  "/ubah-katasandi",
  authMiddleware,
  userController.updatePassword.bind(userController)
);
router.get(
  "/profile/user",
  authMiddleware,
  userController.getProfileUser.bind(userController)
);
router.post("/", userController.createUser.bind(userController));
router.get("/", authMiddleware, userController.getAllUser.bind(userController));
router.get(
  "/detailUser",
  authMiddleware,
  userController.getDetailUser.bind(userController)
);
router.put(
  "/updateUser",
  upload.single("Profile"), // Middleware upload file
  authMiddleware,
  userController.updateUser.bind(userController)
);
router.delete("/:id", userController.deleteUser.bind(userController));

module.exports = router;
