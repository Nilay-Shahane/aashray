let {RescMod} = require('../models/resc.model')
let {HospMod} = require('../models/hosp.model')
let {locnDecoder} = require('../middlewares/locnDecoder')
let {ReqRescMod} = require('../models/reqResc.model')


const topFive = async (req, res) =>{
    try{
        let gmap = req.body.gmap
        let match = await locnDecoder(gmap)        
        if(!match) return res.status(400).json({message: 'Invalid Location'})

        let userLng = parseFloat(match[2])
        let userLat = parseFloat(match[1])

        let topThree = await HospMod.find({
            location:{
                $near:{
                    $geometry:{
                        type: 'Point',
                        coordinates:[userLng,userLat]
                    }
                }
            }
        }).limit(5)
        // res.json(topThree)
        // console.log(topThree)

        let newResc = new RescMod({
            requestedBy : req.body.username,
            acceptedBy : null,
            gmap:req.body.gmap,
            location:{
                type: 'Point',
                coordinates:[userLng,userLat]
            },
            file_url:req.file.path,
            file_name:req.file.filename
            
        })
        try{
        let newRescData= await newResc.save()
        console.log(newRescData)
        }catch(err){
            console.log(err)
            return res.send('Error in savin data')
        }

        for(let hosp of topThree){
            let newReq = new ReqRescMod({
                requestedBy : req.body.username,
                gmap:req.body.gmap,
                location: {
                    type:'Point',
                    coordinates:[userLng,userLat]
                },
                requestedTo: hosp._id
            })
            try{
                let newReqdata = await newReq.save()
                console.log(newReqdata)
                res.send(newReqdata)
            }catch(er){
                console.log(er)
                return res.send('Error in savin data in topThree.foreach()')
            }
        }
        
    }catch(err){
        res.status(500).json({message: err.message})
        console.log(err)
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
    let id = req.body._id
    let userId = req.body.username
try{
    let rescdelete = await RescMod.findByIdAndDelete(id)
    console.log(rescdelete)

    let reqDelete = await RequestMod.deleteMany({
        requestedBy  : userId,
    })
    console.log(reqDelete)

    res.send('Deleted')

}catch(err){
    console.log(err)
    res.send(err)
}
}

module.exports={topFive,sameAnimal,deleteReq}