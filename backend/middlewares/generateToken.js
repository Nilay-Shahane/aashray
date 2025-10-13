const jwt = require("jsonwebtoken")

const generateToken = (userData) => {
    return jwt.sign(userData,process.env.JWT_SECRET,{expiresIn: "1d"});
}

module.exports = {generateToken}