const jwt = require("jsonwebtoken");
const User = require("../models/User");

// checks the jwt cookie and attaches req.user
const protect = async (req, res, next) => {
  const token = req.cookies?.jwt;

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-passwordHash");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { protect };
