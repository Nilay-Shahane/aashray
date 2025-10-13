let express = require('express')
let {topFive, sameAnimal, deleteReq} = require('../controllers/resc.controller')
let rescRouter = express.Router()
let multer = require('multer')

let cloudinary = require('cloudinary').v2
let {CloudinaryStorage} = require('multer-storage-cloudinary')

cloudinary.config({
    cloud_name:'dmrzva2sr',
    api_key:'767332367794647',
    api_secret:'7WKj9YffGujb8E2lMNOwTpOqH34'
})

let storage = new CloudinaryStorage({
    cloudinary: cloudinary,
})

let recep = multer({storage})


rescRouter.post('/top',recep.single('file'),topFive)
rescRouter.post('/initialReq',sameAnimal)
rescRouter.post('/deleteReq',deleteReq)

module.exports={rescRouter}