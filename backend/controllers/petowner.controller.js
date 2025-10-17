const {AdoptPetModel} = require('../models/adoptPet.model')
let cloudinary = require('cloudinary').v2

const listPet=async(req,res)=>{
    let {type,name,species,breed,age,gender,vaccinations,healthInfo,description} = req.body
    let owner_name = req.user.username
    let email = req.user.email
    console.log(owner_name)
        try{
    
        const newPet = new AdoptPetModel({
            owner_name,
            email, type,name,species,breed,age,gender,vaccinations,healthInfo,description,
            file_url: req.file.path,
            file_name: req.file.filename
    
        })
    
        
    
        let result = await newPet.save()
        console.log(result)
        res.json({
            "msg":"Successfully registered the pet "
        })
    }
        catch(err){

        }
}
//-------------------delete----------------------------------------------------
const deletePet = async(req,res)=>{
    let _id = req.body.petId
    console.log(_id)
    try{
        
        let rescData = await AdoptPetModel.findById(_id)
        console.log(rescData)
        if(!rescData) {
            return res.status(404).send('Record not found')
        }
        let rescdelete = await AdoptPetModel.findByIdAndDelete(_id)
                console.log(rescdelete)
        
        
        await cloudinary.uploader.destroy(rescData.file_name)
        
        
        

        res.send('Deleted from both Cloudinary and Database')

    }catch(err){
        console.log(err)
        res.status(500).send(err)
    }
}
//----------getMyPets--------------------
const getMyPets=async(req,res)=>{
    let owner_name = req.user.username
    try{
        let allPets = await AdoptPetModel.find({
            owner_name
        })
        if(allPets){
            console.log(allPets)
            res.json({
                "List of all your pets":allPets
            })
        }
    }catch(err){
        console.log(err)
        res.json({"error":err})
    }
}
module.exports = {listPet,deletePet,getMyPets}