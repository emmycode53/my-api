const express = require('express');
const routes = express.Router();
const orderHistory = require('../controller/orderhistorycontroller')
const authenticateUser = require('../utilities/authenticatetoken');

routes.get('/',authenticateUser, orderHistory);

module.exports = routes;