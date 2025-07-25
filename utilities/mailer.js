const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com", 
  port: 465,
  secure: true, 
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASS 
  },tls: {
    rejectUnauthorized: false
  }

});






// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.USER_MAIL,    
//     pass: process.env.USER_PASS     
//   }
// });


module.exports = transporter;
