const jwt = require("jsonwebtoken");

const generateToken = (UserID) => {
  return jwt.sign({ id: UserID }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_SECRET_EXPIRED,
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Token tidak valid atau kadaluarsa");
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
