const jwt = require("jsonwebtoken")
const {HospMod} = require("../models/hospital.model.js")
let {genAccessToken,genRefreshToken} = require('../middlewares/generateToken.js')

//auth------------------------------------------------------------------
const HospAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  req.access= ''

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Please authenticate." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

    const user = await HospMod.findById(decoded._id);
    if (!user) {
        console.log('UserNotFound')
      return res.status(404).json({ error: "Hospital not found." });
    }

    req.user = user;
    return next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      console.log("Access token expired");

      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ error: "Session expired. Please log in again." });
      }

      try {
        const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

        const user = await HospMod.findById(decodedRefresh._id);
        if (!user) {
          return res.status(404).json({ error: "User not found via refresh." });
        }
         
        let payload = {
        _id: user._id,
        username:user.username,
        role:"hospital"
        }

        const newAccessToken = genAccessToken(payload);

        req.access = newAccessToken;
        req.user =  user // payload??
        return next();
      } catch (refreshErr) {
        console.log("Error in refresh token", refreshErr);
        return res.status(401).json({ error: "Invalid refresh token. Please log in again." });
      }
    }

    console.log("Invalid access token");
    return res.status(401).json({ error: "Invalid access token." });
  }
};

module.exports = {HospAuth}