const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true 
  },

  email :{
   type : String,
   required : true
  },
  password: {
    type: String,
    required: true
  },
  
  isVerified :{
    type : Boolean,
    default : false
  },
  role : {
    type : String,
    enum : ['admin','customer']
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
