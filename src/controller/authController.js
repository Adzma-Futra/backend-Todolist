const express = require("express");
const router = express.Router();
const userRepository = require("../repository/UserRepository");
const defaultBaseResponse = require("../common/baseResponse/defaultBaseResponse");
const { StatusCodes } = require("http-status-codes");
const { checkPassword } = require("../common/utils/securityUtils");
const { generateToken } = require("../common/utils/jwtUtils");

class AuthController {
  // Fungsi login untuk autentikasi pengguna
  async login(req, res) {
    const { Email, Password } = req.body;

    // Validasi input
    if (!Email || !Password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          defaultBaseResponse(
            StatusCodes.BAD_REQUEST,
            null,
            "Email dan kata sandi harus disediakan"
          )
        );
    }

    try {
      const loginAttemptTime = new Date();
      console.log(`Login attempt at: ${loginAttemptTime.toISOString()}`);

      // Cari pengguna berdasarkan email
      const user = await userRepository.getUserByEmail(Email);
      if (!user) {
        console.warn(`Login failed: Email not found - ${Email}`);
        return res
          .status(StatusCodes.NOT_FOUND)
          .json(
            defaultBaseResponse(
              StatusCodes.NOT_FOUND,
              null,
              "Email tidak ditemukan"
            )
          );
      }

      // Pastikan kata sandi diambil dengan benar
      if (!user.Password) {
        console.error(`Kata sandi tidak ditemukan untuk email: ${Email}`);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json(
            defaultBaseResponse(
              StatusCodes.INTERNAL_SERVER_ERROR,
              null,
              "Kata sandi tidak ditemukan, silakan coba lagi"
            )
          );
      }

      console.log("Kata sandi yang dimasukkan:", Password);
      console.log("Hash kata sandi dari database:", user.Password);

      // Validasi kata sandi
      const isPasswordValid = await checkPassword(Password, user.Password);
      console.log("Apakah kata sandi valid?:", isPasswordValid);

      if (!isPasswordValid) {
        console.warn(`Login failed: Incorrect password for email - ${Email}`);
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json(
            defaultBaseResponse(
              StatusCodes.UNAUTHORIZED,
              null,
              "Kata sandi salah"
            )
          );
      }

      // Generate token akses
      const AccessToken = generateToken(user.UserID);
      const LastLogin = new Date();
      await userRepository.updateAccessToken(
        user.UserID,
        AccessToken,
        LastLogin
      );

      // Ambil data profile pengguna
      const userProfile = await userRepository.getUserById(user.UserID);

      if (!userProfile) {
        console.warn(`Profile not found for user ID: ${user.UserID}`);
        return res
          .status(StatusCodes.NOT_FOUND)
          .json(
            defaultBaseResponse(
              StatusCodes.NOT_FOUND,
              null,
              "Profile pengguna tidak ditemukan"
            )
          );
      }

      // Respon berhasil login
      res.status(StatusCodes.OK).json(
        defaultBaseResponse(StatusCodes.OK, true, "Login berhasil", {
          UserID: user.UserID,
          Username: user.Username,
          Email: user.Email,
          AccessToken: AccessToken,
          Profile: userProfile, // Menambahkan data profile ke respons
        })
      );
    } catch (error) {
      console.error("Error during login:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          defaultBaseResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            null,
            "Terjadi kesalahan, silakan coba lagi"
          )
        );
    }
  }
}

const authController = new AuthController();

// Rute untuk login
router.post("/login", (req, res) => authController.login(req, res));

module.exports = router;
