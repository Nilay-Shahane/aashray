let {RescMod} = require('../models/resc.model')
let {HospMod} = require('../models/hospital.model')
let {locnDecoder} = require('../middlewares/locnDecoder')
let {ReqRescMod} = require('../models/reqResc.model')
let cloudinary = require('cloudinary').v2
let {CloudinaryStorage} = require('multer-storage-cloudinary')

const genRequest = async (req, res) => {
    try {
        let gmap = req.body.gmap
        let match = await locnDecoder(gmap)        
        if (!match) return res.status(400).json({message: 'Invalid Location'})

        let userLng = parseFloat(match[2])
        let userLat = parseFloat(match[1])

        // Find top 4 nearest hospitals
        let topThree = await HospMod.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [userLng, userLat]
                    }
                }
            }
        }).limit(4)
        
        console.log('Found hospitals:', topThree)

        // ✅ Create and save rescue request
        let newResc = new RescMod({
            requestedBy: req.user.username,
            acceptedBy: null,
            gmap: req.body.gmap,
            location: {
                type: 'Point',
                coordinates: [userLng, userLat]
            },
            file_url: req.file.path,
            file_name: req.file.filename
        })
        
        let newRescData = await newResc.save()  // ✅ Single try-catch handles this
        console.log('Rescue saved:', newRescData)

        // ✅ Save requests to all hospitals
        let savedRequests = []
        
        for (let hosp of topThree) {
            let newReq = new ReqRescMod({
                requestedBy: req.user.username,
                gmap: req.body.gmap,
                location: {
                    type: 'Point',
                    coordinates: [userLng, userLat]
                },
                requestedTo: hosp._id
            })
            
            let newReqdata = await newReq.save()
            savedRequests.push(newReqdata)
            console.log('Request saved for hospital:', hosp._id)
        }

        // ✅ Send response once after all saves
        res.json({
            message: 'Rescue request created and sent to hospitals',
            rescueData: newRescData,
            hospitalRequests: savedRequests,
            totalHospitals: savedRequests.length
        })
        
    } catch (err) {
        console.log('Error in genRequest:', err)
        res.status(500).json({message: err.message})
    }
}
//------------------------------------------------------------------------------------------------------------------------
const sameAnimal = async(req,res)=>{
    let gmap = req.body.gmap
    let match = await locnDecoder(gmap)
    if(!match) return res.status(400).json({message: 'Invalid Location'})

    let maxRadius = 10//metres
    let userLng = parseFloat(match[2])
    let userLat = parseFloat(match[1])
    try{

    let nearBy = await RescMod.find({
        location:{
            $near:{
                $geometry:{
                    type: 'Point',
                    coordinates:[userLng,userLat]
                },
                $maxDistance:maxRadius
            }
        }
    })
        if(nearBy.length>0) {
            let images = nearBy.map(sample=>{
                return sample.file_url
            })
            res.json({
                message:"Animals from same location",
                data :images
            })
        }
        else{
            res.json({
                message:"confirm?",
                data:req.body 
            })
        }
    
}catch(err){
    console.log(err)
    res.send(err)
}
}
//----------------------------------------------------------------------------------------------------------

const deleteReq = async(req,res)=>{
    let id = req.user._id
    let username = req.user.username
    
    try{
        
        let rescData = await RescMod.findById(id)
        
        if(!rescData) {
            return res.status(404).send('Record not found')
        }
        
        await cloudinary.uploader.destroy(rescData.file_name)
        
        
        let rescdelete = await RescMod.findByIdAndDelete(id)
        console.log(rescdelete)

        let reqDelete = await ReqRescMod.deleteMany({
            requestedBy: username,
        })
        console.log(reqDelete)

        res.send('Deleted from both Cloudinary and Database')

    }catch(err){
        console.log(err)
        res.status(500).send(err)
    }
}

module.exports={genRequest,sameAnimal,deleteReq}