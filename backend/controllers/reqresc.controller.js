let {HospMod} = require('../models/hospital.model')
let {ReqRescMod} = require('../models/reqResc.model')
let {RescMod} = require('../models/resc.model')
let {locnDecoder} = require('../middlewares/locnDecoder')

let axios = require('axios')

//decoder------------------------------------------------------------------------------------------------


const acceptReq=async (req,res)=>{
    let niceHosp = req.user._id
    let reqRescId = req.body.reqId

    try{

        let validReq = await RescMod.findById(reqRescId)
        if(!validReq) return res.json({
            message : "Request accepted by other hospital",
        })
        else{
            let userId = validReq.requestedBy
            let accepted = await RescMod.findOneAndUpdate(
               { requestedBy : userId},
               {
                $set:{
                    acceptedBy:niceHosp,
                    status:"accepted"
                }
               },
               {new:true}

            )
            console.log(accepted)

            let deleted = await ReqRescMod.deleteMany({
                requestedBy:userId
            })
            console.log(deleted)
            res.json({
            message: "Request accepted",
            acceptedBy: niceHosp,
            updatedRescue: accepted
        });
        }
    }catch(err){
        console.log(err)
        res.send(err)
    }

}

const updateStatus = async (req,res)=>{
    let reqId = req.user._id
    try{
        let updatedStatus = await RescMod.findByIdAndUpdate(
            reqId,
            {
                $set:{
                    status:req.body.status
                }
            }
        )
        console.log(updatedStatus)
        res.send(updatedStatus)
    }catch(err){
        console.log(err)
        res.send(err)
    }
}
module.exports={acceptReq,updateStatus}