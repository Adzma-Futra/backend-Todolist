const { StatusCodes } = require("http-status-codes");
const { verifyToken } = require("../common/utils/jwtUtils");
const baseResponse = require("../common/baseResponse/defaultBaseResponse");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json(
        baseResponse(
          StatusCodes.FORBIDDEN,
          false,
          "Tidak ada token yang disediakan!"
        )
      );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.UserID = decoded.id; // Menyimpan userID dari payload token
    next(); // Lanjutkan ke handler berikutnya
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(
        baseResponse(
          StatusCodes.UNAUTHORIZED,
          false,
          "Permintaan tidak terautentikasi!"
        )
      );
  }
};

module.exports = authMiddleware;
