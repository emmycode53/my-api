const express = require('express')
const bcrypt = require('bcrypt')
const userSchema = require('../schema/userschema');
const otpGenerator = require('../utilities/otp');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const smtp = require('../utilities/mailer');
const otpDetail = require('../schema/otpschema');
const User = require('../schema/userschema');






const JWT_key = process.env.JWT_secrete_key;

const newUser = async (req, res) => {
  try {
    const { fullName, email, password, role} = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

     const doesEmailExist = await userSchema.findOne({ email });

if (doesEmailExist) {
  return res.status(409).send({ message: 'Email already exists' });
}

const newUser = await userSchema.create({fullName, email, password: hashedPassword, role});

const generatedOtp = otpGenerator()

await otpDetail.create({
  otp : generatedOtp,
  userId : newUser._id,
  purpose : "verify-email"
});

smtp.sendMail({
  from : `my-api <${process.env.USER_MAIL}>`,
  to : email,
  subject: "🔐 Your Verification Code",
  text: `Your OTP code is: ${generatedOtp}`,
  html : `<div> 
   <p> your otp code is ${generatedOtp}..</p>
  </div>`}, (err, info) => {
  if (err) {
    console.error('Error sending email:', err);
  } else {
    console.log('Email sent successfully:', info.response);
  }
})

const payload = {
    userId: newUser._id,
    email: newUser.email,
    role: newUser.role
  };

  const token = jwt.sign(payload, JWT_key)

    res.status(201).json({ message: 'User created successfully, an OTP has been sent to your email', fullName,token });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const verifyOtp = async (req, res) => {
  const { email, otp, purpose } = req.body;

  if (!email || !otp || !purpose) {
    return res.status(400).json({ message: 'Email, OTP, and purpose are required' });
  }

  try {
   
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otpEntry = await otpDetail.findOne({
      userId: user._id,
      purpose
    });

    if (!otpEntry) {
      return res.status(400).json({ message: 'OTP expired or not found' });
    }

   
    if (otpEntry.otp !== parseInt(otp)) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (purpose === 'verify-email') {
      user.isVerified = true;
      await user.save();
    }

    await otpDetail.deleteOne({ _id: otpEntry._id });

    res.status(200).json({ message: 'OTP verified successfully' });

  } catch (err) {
    console.error('Error verifying OTP:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};




const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userSchema.findOne({ email }).select('+passWord');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });

    }

    
    console.log('password from req.body:', password);
    console.log('user.password from db:', user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({  userId:user._id, email:user.email, role:user.role }, process.env.JWT_SECRET_KEY);
    
    res.status(200).json({
      message: 'Login successful',token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports ={
    newUser,
    verifyOtp,
    login
};
