let mongoose= require('mongoose')

const adoptPetSchema = new mongoose.Schema({
  owner_name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['NGO', 'Pet_Store', 'Individual'],
    default: 'Individual',
    required:true,
  },
  name: String,

  species: String,
   // dog, cat, rabbit etc.
  breed: String,

  age: Number,

  gender: String,
  
  // vaccinations: [{
  //   name: String, // e.g. "Rabies", "Parvo", "Distemper"
  //   dateAdministered: Date,
  //   nextDueDate: Date,
  //   vetClinic: String,
  // }],
  // healthInfo: {
  //   isNeutered: Boolean,
  //   hasDisabilities: Boolean,
  //   medicalConditions: [String], // e.g. ["Diabetes", "Hip dysplasia"]
  //   lastHealthCheckDate: Date,
  //   vetNotes: String
  // },
  file_name:{
        type:String
    },
    file_url:{
        type:String
    },
  description: String,
  isAdopted: {
    type: Boolean,
    default: false
  },
//   listedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'AdoptionCenter'
//   }
}, {
  timestamps: true
});

const AdoptPetModel = mongoose.model('adoptPetSchema', adoptPetSchema);
module.exports = { AdoptPetModel };