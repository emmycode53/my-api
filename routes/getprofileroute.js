const express = require('express');
const routes = express.Router();
const profile = require('../controller/profile');
const authenticateUser = require('../utilities/authenticatetoken');

routes.get('/',authenticateUser,profile);

module.exports = routes;