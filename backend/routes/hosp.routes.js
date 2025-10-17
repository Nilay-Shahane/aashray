const express = require("express");
const { signUpNewHosp,login,addslot, deleteSlot,searchHosp,getHosp,getHospitalByID,deleteAcc,updateAcc } = require("../controllers/hosp.controller.js");
const { acceptReq,updateStatus } = require("../controllers/reqresc.controller.js")
const { HospAuth } = require("../middlewares/hospAuth.js");


const hospRouter = express.Router();

hospRouter.post('/register',signUpNewHosp);
hospRouter.post('/login',login);
hospRouter.post('/add-slot',HospAuth,addslot);
hospRouter.delete('/:hospitalId/slots/:slotId', deleteSlot);
hospRouter.get('/me',HospAuth,getHosp);
hospRouter.get('/:id',getHospitalByID);
hospRouter.delete('/deleteHosp',HospAuth,deleteAcc)
hospRouter.patch('/hospUpdateAcc',HospAuth,updateAcc)
hospRouter.post('/acceptReq',HospAuth,acceptReq)
hospRouter.post('/updateStatus',HospAuth,updateStatus)

module.exports = hospRouter
