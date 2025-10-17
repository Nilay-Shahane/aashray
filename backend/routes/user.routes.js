const express = require("express");

const { getCurrentUser,nearByHosp,signUpNewUser,bookSlot,login,deleteAcc,updateAcc,getUserProfile} = require("../controllers/user.controller.js");
const {getAllPets,wantToAdopt} = require('../controllers/adopter.controller.js')
const { userAuth } = require("../middlewares/userAuth.js");
const {searchHosp} = require("../controllers/hosp.controller.js")
const {listPet,deletePet,getMyPets} = require('../controllers/petowner.controller.js')
let multer = require('multer')

let cloudinary = require('cloudinary').v2
let {CloudinaryStorage} = require('multer-storage-cloudinary')

let storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params:{
        folder:'adopt'
    }
})

let upp = multer({storage})
const userRouter = express.Router();

userRouter.get("/profile",userAuth, getCurrentUser);
userRouter.post("/nearby", userAuth, nearByHosp);
userRouter.post("/register",signUpNewUser);
userRouter.post("/book-slot",bookSlot);
userRouter.post("/login",login);
userRouter.post("/search",searchHosp);
userRouter.delete('/deleteUser',userAuth,deleteAcc)
userRouter.patch('/userUpdateAcc',userAuth,updateAcc)
userRouter.get('/profile', getUserProfile);
userRouter.get('/getAllPets',getAllPets)
userRouter.get('/getMyPets',userAuth,getMyPets)

userRouter.post('/wantToAdopt',userAuth,wantToAdopt)
userRouter.post('/listPet',upp.single('file'),userAuth,listPet)
userRouter.post('/deletePet',userAuth,deletePet)


module.exports = userRouter