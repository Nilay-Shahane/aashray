let mongoose = require('mongoose')

let rescSchema = mongoose.Schema({
    requestedBy:String,
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
    file_name:{
        type:String
    },
    file_url:{
        type:String
    },
    acceptedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'HospMod',
        default:null
    },
    status:{
        type:String,
        enum:['pending','accepted','rescued'],
        default:'pending'   
    },
    requestTime:{
        type:Date,
        default:Date.now()
    },
    acceptTime:{
        type:Date,
        default:null
    }
})
rescSchema.index({ location: '2dsphere' });


let RescMod = mongoose.model('Resc',rescSchema)
module.exports={RescMod}