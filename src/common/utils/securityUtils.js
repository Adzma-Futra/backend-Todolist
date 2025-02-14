const bcrypt = require("bcrypt");

// Fungsi untuk mengenkripsi kata sandi
const hashPassword = async (Password) => {
  try {
    const saltRounds = 10; // Bisa diubah sesuai kebutuhan
    const hashedPassword = await bcrypt.hash(Password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error("Gagal mengenkripsi kata sandi");
  }
};

// Fungsi untuk memeriksa kata sandi yang dimasukkan dengan yang telah di-hash
const checkPassword = async (Password, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(Password, hashedPassword);
    return isMatch; // Mengembalikan true jika cocok, false jika tidak
  } catch (error) {
    throw new Error("Gagal memverifikasi kata sandi");
  }
};

const comparePassword = async (Password, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(Password, hashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error("Gagal memperbarui kata sandi");
  }
};

module.exports = { hashPassword, checkPassword, comparePassword };
