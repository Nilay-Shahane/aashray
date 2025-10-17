const jwt = require('jsonwebtoken');
const { UserModel } = require('../models/user.model.js');
let {genAccessToken,genRefreshToken} = require('../middlewares/generateToken.js')
require('dotenv').config()
//auth------------------------------------------------------------------
const userAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  req.access= ''
  console.log(authHeader)
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Please authenticate." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

    const user = await UserModel.findById(decoded._id);
    if (!user) {
        console.log('UserNotFound')
      return res.status(404).json({ error: "User not found." });
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

        const user = await UserModel.findById(decodedRefresh._id);
        if (!user) {
          return res.status(404).json({ error: "User not found via refresh." });
        }

        const newAccessToken = genAccessToken(user._id);

        req.access = newAccessToken;
        req.user = user;
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

module.exports = {userAuth}