let mongoose= require('mongoose')

const adoptPetSchema = new mongoose.Schema({
  name: String,

  species: String,
   // dog, cat, rabbit etc.
  breed: String,

  age: Number,

  gender: String,
  
  vaccinations: [{
    name: String, // e.g. "Rabies", "Parvo", "Distemper"
    dateAdministered: Date,
    nextDueDate: Date,
    vetClinic: String,
  }],
  healthInfo: {
    isNeutered: Boolean,
    hasDisabilities: Boolean,
    medicalConditions: [String], // e.g. ["Diabetes", "Hip dysplasia"]
    lastHealthCheckDate: Date,
    vetNotes: String
  },
  imageUrl: String,
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