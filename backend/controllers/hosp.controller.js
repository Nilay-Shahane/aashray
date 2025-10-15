// const mongoose = require('mongoose')
const bcrypt = require('bcrypt') // do bcryptjs if not working
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
require('dotenv').config()
const axios = require('axios')

const {HospMod} = require('../models/hospital.model.js')
let {locnDecoder} = require('../middlewares/locnDecoder.js')
let {genAccessToken,genRefreshToken} = require('../middlewares/generateToken.js')



 let crypter = async (password) =>{
    const salt = await bcrypt.genSalt(11)
    let hash = await bcrypt.hash(password,salt)
    return hash
 }

 

    let codeGen = ()=>{
        return code = Math.random() * 6
    }
 //newUser---------------------------------------------------------------

 let signUpNewHosp = async (req,res)=>{
    let {username,password,email,contactNumber,gmap,address,licenseNumber,services,availableBeds} = req.body

    try{
    let hashedPass = await crypter(password)
    let match = await locnDecoder(gmap)
    if(!match) return res.json({message:'Invalid link'}) 
    let location = {
            type:'Point',
            coordinates:[parseFloat(match[2]),parseFloat(match[1])]
    }

    const newHosp = new HospMod({
        username ,
        password: hashedPass ,
        email, contactNumber,gmap,address,location,
        licenseNumber,services,
        availableBeds: parseInt(availableBeds||"0",10)
    })

    

    let result = await newHosp.save()
    console.log(result)

    let payload = {
        _id: result._id,
        username:result.username,
        role:"hospital"
    }

    let accessToken =   await genAccessToken(payload)
    let refreshToken =  await genRefreshToken(payload)

    res.cookie('refreshToken',refreshToken,{
        httpOnly:false, 
        secure:false, //only use in production lvl
        maxAge: 7*24*60*60*1000, // expires in 7 days
        sameSite:'lax' // same site access and top urls access
    })
    try{

            const transporter = nodemailer.createTransport({
                service: 'gmail', // Use Gmail service
                auth: {
                  user: 'aashray43@gmail.com', // Your email
                  pass: 'ugyh baxz cnmo dcyk' // Your app password
                },
                tls: {
                  rejectUnauthorized: false
                }
              });

              const mailOptions = {
                from: 'aashray43@gmail.com', // Sender address
                to: email, // Receiver address
                subject: 'Signup Confirmation', // Subject
                text: `You have successfully signedup for Aashray ${username}\n\nBest Regards,\nTeam Aashray`
              };

              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.error('Error sending email:', error);
                  return res.status(500).send('Error sending email');
                } else {
                  console.log('Email sent: ' + info.response);
                  
                }
              });
              res.json({accessToken,refreshToken})
            } catch (err) {
              console.error('Error saving data:', err);
              return res.status(500).send('Error saving data');
           }
        }catch(err){
            return console.log(err)
    }
    console.log(`NEW USER REGISTERED ${username}`)
 }

//login---------------------------------------------------------------
const login = async (req, res) =>{
    let {username,password} = req.body
    try{
    let loginUser = await HospMod.findOne({username})
    if(!loginUser){
        return res.json({
            "message":"User Not Found"
        })
    }
    let isValidPass = await bcrypt.compare(password,loginUser.password)
    if(!isValidPass){
        return res.json({"message":"Incorrect Password"})
    }
    let payload = {
        _id: loginUser._id,
        username:loginUser.username,
        role:"hospital"
    }
        let accessToken = await genAccessToken(payload)
        let refreshToken = await genRefreshToken(payload)

        res.cookie('refreshToken',refreshToken,{
            httpOnly:false, 
            secure:false, //only use in production lvl
            maxAge: 7*24*60*60*1000, // expires in 7 days
            sameSite:'lax' // same site access and top urls access
        })

        
        res.json({
            "message":"Login Successfull",
            "accessToken": accessToken
        })

    }catch(err){
        console.log(err)
        res.json({
            "message":"Error",
            "error":err

        })
    }
}



//delete------------------------------------------------------------------
const deleteAcc = (req,res)=>{
    const userId = req.user._id
    HospitalModel.findByIdAndDelete(userId)
    .then(()=>{
        res.send('Account deleted')
    })
    .catch((err)=>{
        console.log('Error in deleting acc',err)
        res.send('Error in deleting account')
    })
}

//update------------------------------------------------------------
const updateAcc = (req,res)=>{
    userId = req.user._id
    let updates = req.body
    console.log(updates)

    HospitalModel.findByIdAndUpdate(userId,
        {
            $set : updates // updates is a json object which contains parameterToBeUpdates:Value
        },{
        new:true,
        runValidators:true
    })
    .then((result)=>{
        res.send(result)
        console.log(`Updates ${result}`)
    })
    .catch((err)=>console.log(err))
}
//-----------------------add slot -------------------------

const addslot = async (req, res) => {
  try {
    const { slotDateTime } = req.body;

    if (!slotDateTime) {
      return res.status(400).json({ message: "Slot date & time is required" });
    }

    const hospital = req.user;
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    const slotExist = hospital.slots.some(
      slot => slot.slotDateTime.toISOString() === new Date(slotDateTime).toISOString()
    );
    if (slotExist) {
      return res.status(409).json({ message: "Slot already exists" });
    }

    hospital.slots.push({ slotDateTime: new Date(slotDateTime), isBooked: false });
    await hospital.save();

    res.status(200).json({ message: "Slot added", slot: hospital.slots[hospital.slots.length - 1] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding slot", error: err.message });
  }
};

//-------del slot --------------------------------------

const deleteSlot = async (req, res) => {
    try {
        
        const { slotId } = req.params;

        
        const hospital = req.user;

        const slotIndex = hospital.slots.findIndex(slot => slot._id.toString() === slotId);

        if (slotIndex === -1) {
            return res.status(404).json({ message: "Slot not found in this hospital" });
        }

        if (hospital.slots[slotIndex].isBooked) {
            return res.status(403).json({ message: "Cannot delete a slot that is already booked" });
        }

        // 4. Remove the slot and save
        hospital.slots.splice(slotIndex, 1);
        await hospital.save();

        res.status(200).json({ message: "Slot deleted successfully" });

    } catch (err) {
        console.error("Error in deleteSlot:", err);
        res.status(500).json({ message: "Error deleting slot", error: err.message });
    }
};

//-----------searchHosp--------------------------------------------------------------

const searchHosp = async(req,res) => {
    try {
        const {query} = req.body;

        const hospitals = await HospMod.find({
            username:{$regex:query,$options:"i"}
        });

        res.json({hospitals});
    }
    catch(err)
    {
        console.log("error searching hosppital:",err)
        res.status(501).json({message:"server error"})
    }
}

//----------------------------getHosp-------------------------------

const getHosp = async(req,res) => {
    try {
        res.json(req.user);
    }
    catch(err){
        console.log("error in getting hosp data")
        res.status(500).json({message:"server error"})
    }
}

//-------------------getHospbyId---------------------------

const getHospitalByID = async (req,res) => {
    try {
        const hosp = await HospMod.findById(req.params.id)

        if(!hosp) {
            return res.status(404).json({message:"hospital not found"})
        }

        res.json(hosp);
    }
    catch(err) {
        console.log("err in getting hospital data by ID")
        res.status(500).json({message:"server error"})
    }
}

module.exports={signUpNewHosp,login,deleteAcc,updateAcc,addslot,searchHosp,getHosp ,getHospitalByID,deleteSlot}