const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
  username: {
    type:String,
    required:true,
    unique:true
  },
  
  password: {
    type:String,
    required:true
  }
})

adminSchema.methods.comparePassword = async function (inputPassword) {
    return await bcrypt.compare(inputPassword,this.password)
}

const Admin = mongoose.model("Admin", adminSchema);

module.exports = { Admin };
