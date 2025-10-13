const jwt = require("jsonwebtoken")


let genAccessToken = async (payload)=>{
    return jwt.sign(payload,process.env.ACCESS_SECRET,{
        expiresIn: '1d'
    })
}

let genRefreshToken =  async (payload) =>{
    return jwt.sign(payload,process.env.REFRESH_SECRET,{
        expiresIn: '30d'
    })
}


module.exports = {genAccessToken,genRefreshToken}