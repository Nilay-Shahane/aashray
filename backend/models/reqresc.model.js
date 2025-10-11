let mongoose = require('mongoose')

let reqRescSchema = mongoose.Schema({
    requestedBy:String,
    gmap:String,
    location:{
        type: {
            type: String,
            enum: ['Point'],  
            required: true
        },
        coordinates: {
            type: [Number],   
            required: true
        }
    },
    requestedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'HospMod',
        default:null
    },
    requestTime:{
        type:Date,
        default:Date.now()
    }
    
})

let ReqRescMod = mongoose.model('reqresc',reqRescSchema)
module.exports={ReqRescMod}