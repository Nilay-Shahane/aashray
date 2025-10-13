const jwt = require("jsonwebtoken")
const {HospMod} = require("../models/hospital.model.js")

const HospAuth = async(req,res,next) => {
    
    const auth = req.headers.authorization;
    if(!auth) {
        return res.status(401).json("hosp token not found")
    }

    const token = req.headers.authorization.split(' ')[1];
    if(!token) {
        return res.status(401).json("unauthorised")
    }

    try {
        const decoded = await jwt.verify(token,process.env.JWT_SECRET)
        const hosp = await HospMod.findById(decoded._id).select('-password');

        if(!hosp) {
            return res.status(401).json("invalid token")
        }

        req.hosp = hosp;
        next();
    }
    catch(err) {
        console.log(err)
        return res.status(501).json("server errir")
    }
}

module.exports = {HospAuth}