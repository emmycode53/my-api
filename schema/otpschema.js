const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  otp: {
    type: Number,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  purpose :{
    type : String,
    required : true,
    enum : ['verify-email', 'reset-password']
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 
  }
});

const otp = mongoose.model('Otp', otpSchema)

module.exports = otp;
