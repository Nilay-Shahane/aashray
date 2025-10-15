const express = require("express");
const { signUpNewHosp,login,addslot, deleteSlot,getHosp,getHospitalByID,deleteAcc,updateAcc } = require("../controllers/hosp.controller.js");
// const { acceptReq,updateStatus } = require("../controllers/reqresc.controller.js")
const { HospAuth } = require("../middlewares/hospAuth.js");


const hospRouter = express.Router();

hospRouter.post('/register',signUpNewHosp);
hospRouter.post('/login',login);
hospRouter.post('/add-slot',HospAuth,addslot);
hospRouter.delete('/slots/:slotId', HospAuth, deleteSlot);
hospRouter.get('/me',HospAuth,getHosp);
hospRouter.get('/:id',getHospitalByID);
// hospRouter.delete('/deleteHosp',HospAuth,deleteAcc)
// hospRouter.patch('/hospUpdateAcc',HospAuth,updateAcc)
// hospRouter.post('/acceptReq',acceptReq)
// hospRouter.post('/updateStatus',updateStatus)

module.exports = hospRouter
