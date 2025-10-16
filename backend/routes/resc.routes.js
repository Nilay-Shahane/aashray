let express = require('express')
let {genRequest, sameAnimal, deleteReq} = require('../controllers/resc.controller')
let rescRoutes = express.Router()
let multer = require('multer')
require('dotenv').config()
let {userAuth} = require('../middlewares/userAuth')


let cloudinary = require('cloudinary').v2
let {CloudinaryStorage} = require('multer-storage-cloudinary')


let storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params:{
        folder:'rescue'
    }
})

let recep = multer({storage})


rescRoutes.post('/genRequest',recep.single('file'),userAuth,genRequest)
rescRoutes.post('/initialReq',sameAnimal)
rescRoutes.post('/deleteReq',userAuth , deleteReq)

module.exports=rescRoutes