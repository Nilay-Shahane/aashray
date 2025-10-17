const nodemailer = require('nodemailer')
const {AdoptPetModel} = require('../models/adoptPet.model')
const wantToAdopt=async (req,res)=>{
    _id = req.body.animalId
    user = req.user

    try{
        let wantedPet = await AdoptPetModel.findById(_id)
        if(wantedPet){
            const transporter = nodemailer.createTransport({
                            service: 'gmail', // Use Gmail service
                            auth: {
                              user: 'aashray43@gmail.com', // Your email
                              pass: 'ugyh baxz cnmo dcyk' // Your app password
                            }
                          });
            
                          const mailOptions = {
                            from: 'aashray43@gmail.com', // Sender address
                            to: user.email, // Receiver address
                            subject: 'Contact Information for adoption', // Subject
                            text: `Contact information of owner of ${wantedPet.name} is \n gmail:${wantedPet.email}`
                          };
            
                          transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                              console.error('Error sending email:', error);
                              return res.status(500).send('Error sending email');
                            } else {
                              console.log('Email sent: ' + info.response);
                              res.json({
                "email":info.response
            })
                            }
                          });
        }
    }catch(err){
        console.log(err)
        res.json({"error":err})
    }
}
//-----------------getPets-----------------------------

const getAllPets =async (req,res)=>{
    try{
        let allPets = await AdoptPetModel.find()
        if(allPets){
            console.log(allPets)
            res.json({
                "List of all available pets":allPets
            })
        }
    }catch(err){
        console.log(err)
        res.json({"error":err})
    }
}

module.exports={getAllPets,wantToAdopt}