// he hospital model aahe geojson support karnara
const bcrypt = require("bcryptjs")
const mongoose = require('mongoose');


const hospSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type:String,
    required:true,
    unique:true
  },
  gmap: {
    type: String,
    required: true
  },
  address: {
    type:String,
    required:true
  },
  password: {
    type: String,
    required: true
  },
  location: {
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

  services: [String],

  licenseNumber: {
  type: String,
  required: true,
  unique: true,
  },

  availableBeds: {
    type: Number,
    default: 0,
  },

  slots: [
    {
      slotDateTime: { type: Date, required: true },
      isBooked: { type: Boolean, default: false },
      petDetails: {
        petName: String,
        species: String,
        age: Number,
        ownerName: String,
        contact: String
    }
    }
  ]
}, {
  timestamps: true
});

hospSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
}

hospSchema.index({ location: '2dsphere' });

const HospMod = mongoose.model('HospMod', hospSchema);
module.exports = { HospMod };