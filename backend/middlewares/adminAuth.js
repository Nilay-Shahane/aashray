const jwt = require("jsonwebtoken");
const { Admin } = require("../models/admin.model.js");

const adminAuth = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Admin token not found" });
  }

  const token = auth.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    const admin = await Admin.findById(decoded.id).select('-password');


    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired admin token" });
  }
};


//------------------------------- anoushka admin ------------------------------------------//

const seller = (req, res, next) => {
  if (req.user && req.user.isSeller) {                                            
    next(); 
  } else {
    res.status(403).json({ message: 'Not authorized. Seller account required.' });
  }
};

module.exports = { adminAuth,seller };