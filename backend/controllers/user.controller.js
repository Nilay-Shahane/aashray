const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
require('dotenv').config()

const {UserModel} = require('../models/user.model')
let {locnDecoder} = require('../middlewares/locnDecoder.js')
let {genAccessToken,genRefreshToken} = require('../middlewares/generateToken.js')





 let crypter = async (password) =>{
    const salt = await bcrypt.genSalt(11)
    let hash = await bcrypt.hash(password,salt)
    return hash
 }
 //newUser---------------------------------------------------------------

 let signUpNewUser = async (req,res)=>{
    let {username,password,email,contactNumber,gmap} = req.body

    const exists = await UserModel.findOne({username});

    if(exists) {
      return res.status(400).json({message:"Username is already used"})
    }

    let match = await locnDecoder(gmap)    
    if(!match) return res.json({message:'Invalid link'}) 
    
    let location = {
        type:'Point',
        coordinates:[parseFloat(match[2]),parseFloat(match[1])]
    }

    try{
    let hashedPass = await crypter(password)

    const newUser = new UserModel({
        username ,
        password: hashedPass ,
        email, contactNumber,
        gmap,location
    })

    let result = await newUser.save()
    console.log(result)

    let payload = {
        _id: result._id,
        username:result.username,
        role:"user"
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
                  res.json({accessToken,refreshToken})
                }
              });
              // res.json({accessToken,refreshToken})
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
    let loginUser = await UserModel.findOne({username})
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
            "accessToken":accessToken
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
    UserModel.findByIdAndDelete(userId)
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

    UserModel.findByIdAndUpdate(userId,
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
//--------------------getCurrUser--------------------------------------------

const getCurrentUser = async (req, res) => {
  try {
    const userData = req.user
    console.log("User Data : ",userData);

    const userId = userData.id;
    const user =await UserModel.findById(userId);

    res.status(200).json({user})
  } 
  catch(err) {
    console.log(err)
    return res.status(500).json({message:"server error"})
    }
}

//-------------tophospNearme------------------------
const nearByHosp = async (req, res) =>{
    try{
        
        const [userLng ,userLat] = req.user.location.coordinates;

        let topThree = await HospMod.find({
            location:{
                $near:{
                    $geometry:{
                        type: 'Point',
                        coordinates:[userLng,userLat]
                    }
                }
            }
        }).limit(3)
        res.json({hospitals:topThree , userLocation: {lat: userLat,lng: userLng}})
        console.log(topThree)

    }catch(err){
        res.status(500).json({message: err.message})
        console.log(err)
    }
}
//-----bookSlot---------------------------------------------------------------------------

const bookSlot = async(req,res)=>{
  try {
    const {username,time,petName, species, age, ownerName, contact}=req.body;
    if(!username || !time){
      return res.status(400).json({message:"Slot time is required"});
    }

    if(!petName || !species || !age || !ownerName ){
      return res.status(400).json({message:"Pet details are required required"});
    }

    const hospital= await HospMod.findOne({username});
    
    if(!hospital) {
      return res.status(400).json({message:"Hosp not found"})
    }

    const slotNo = hospital.slots.findIndex(slot=>slot.time===time)

    if(slotNo === -1){
      return res.status(404).json({message:"slot not found"})
    }

    if(hospital.slots[slotNo].isBooked) {
      return res.status(409).json({message:"slot is already booked"})
    }

    hospital.slots[slotNo].isBooked = true;
    hospital.slots[slotNo].petDetails = {
      petName,
      species,
      age,
      ownerName,
      contact
    };
    const updateHosp = await hospital.save();

    res.status(200).json({message:"slot booked successfully",hospital:updateHosp})

  }
  catch(err)
  {
    console.log(err);
    res.status(401).json({message:"Error booking slot",status:401})


    }
}

//----------------anoushkaController---------------------
const getUserProfile = async (req, res) => {
  res.status(200).json(req.user);
};
module.exports={signUpNewUser,login,deleteAcc,updateAcc,getCurrentUser,nearByHosp,bookSlot,getUserProfile}