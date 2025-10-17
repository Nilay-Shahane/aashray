const mongoose = require('mongoose');

const adoptSchema = new mongoose.Schema({
  owner_name: {
    type: String,
    required: true,
    trim: true
  },
  contactPerson: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  location: {
    lat: {
      type: Number,
      required: true
    },
    lon: {
      type: Number,
      required: true
    }
  },
  type: {
    type: String,
    enum: ['NGO', 'Pet_Store', 'Individual'],
    default: 'Individual',
    required:true,
  },
  adminCode:{
    type:Number,
    required:true,
    unique:true
  }
//   listedPets: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Pet'
//   }]
}, {
  timestamps: true
});

const AdoptSchema = mongoose.model('AdoptionCenterModel', adoptSchema);
module.exports = { AdoptSchema };