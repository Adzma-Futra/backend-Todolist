const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
require("@babel/register")({
  extensions: [".js", ".jsx"], // This allows Babel to transpile .js and .jsx files
});
const sequelize = require("./src/config/databaseConfig");
const userRouter = require("./src/controller/UserController");
const authRouter = require("./src/controller/authController");
const listRouter = require("./src/controller/ListController");
const todayRouter = require("./src/controller/TodayController");
const dayRouter = require("./src/controller/DayController");
const weekRouter = require("./src/controller/WeekController");
const monthRouter = require("./src/controller/MonthController");

// Untuk aplikasi Express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rute
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/list", listRouter);
app.use("/today", todayRouter);
app.use("/day", dayRouter);
app.use("/week", weekRouter);
app.use("/month", monthRouter);

//url gambar
app.use('/uploads', express.static('uploads'));

// Mengatur sinkronisasi database
const syncDb = process.env.DB_SYNC === "true"; // Mengambil nilai dari environment

sequelize
  .sync({ force: false }) // Menggunakan force: false untuk tidak menghapus data saat sinkronisasi
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server berjalan pada port ${process.env.PORT}`);
      if (syncDb) {
        console.log("Database telah disinkronisasi.");
      } else {
        console.log("Sinkronisasi database dinonaktifkan.");
      }
    });
  })
  .catch((err) => {
    console.error("Gagal menyinkronkan database:", err);
  });