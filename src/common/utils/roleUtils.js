const checkUserRole = (req, res, next) => {
  if (!req.UserID || !req.UserID.Role) {
    return res.status(403).json({ message: "Tidak memiliki akses" });
  }

  if (req.UserID.Role !== "user") {
    return res
      .status(403)
      .json({ message: "Hanya user biasa yang dapat melakukan aksi ini" });
  }

  next();
};

module.exports = checkUserRole;
