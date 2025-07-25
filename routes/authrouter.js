const express = require('express');
const router = express.Router(); 
const auth = require ('../controller/authcontroller');
const authenticateUser = require('../utilities/authenticatetoken');

router.post('/login',  auth.login)
router.post('/register', auth.newUser)
router.post('/verify', auth.verifyOtp )

module.exports = router;