const express = require("express");

const { getCurrentUser,nearByHosp,signUpNewUser,bookSlot,login,deleteAcc,updateAcc,getUserProfile} = require("../controllers/user.controller.js");

const { userAuth } = require("../middlewares/userAuth.js");
const {searchHosp} = require("../controllers/hosp.controller.js")



const userRouter = express.Router();

userRouter.get("/profile",userAuth, getCurrentUser);
userRouter.post("/nearby", userAuth, nearByHosp);
userRouter.post("/register",signUpNewUser);
userRouter.post("/book-slot",userAuth,bookSlot);
userRouter.post("/login",login);
userRouter.post("/search",searchHosp);
userRouter.delete('/deleteUser',userAuth,deleteAcc)
userRouter.patch('/userUpdateAcc',userAuth,updateAcc)
userRouter.get('/profile', getUserProfile);

module.exports = userRouter