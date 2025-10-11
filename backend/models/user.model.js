const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide your username.'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email.'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    select: false,
  },
//   role: {
//     type: String,
//     enum: ['customer', 'admin'],
//     default: 'customer',
//   },
  gmap: {
    type: String,
    required:true,
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
  contactNumber: {
     type: String,
     required: true
 },
  validResc:{
     type:Number,
     default:0
}
}, {
  timestamps: true,
});

// hash the password before saving
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   const salt = await bcrypt.genSalt(12);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = { User };