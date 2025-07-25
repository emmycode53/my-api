function generateOtp(){
    return Math.floor(Math.random() * 10000);
}

module.exports = generateOtp;