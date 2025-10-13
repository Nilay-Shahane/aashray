const jwt = require("jsonwebtoken");
const {User} = require("../models/user.model.js")
const {HospMod} = require("../models/hospital.model.js")
const {Admin} = require("../models/admin.model.js");

const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user =
      (await User.findById(decoded.id).select("-password")) ||
      (await HospMod.findById(decoded.id).select("-password")) ||
      (await Admin.findById(decoded.id).select("-password"));

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    req.role = user.role || "unknown";
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid" });
  }
};

module.exports = {optionalAuth};
