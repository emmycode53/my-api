const express = require('express');
const route = express.Router();
const order = require('../controller/ordercontroller')
const authenticateUser = require('../utilities/authenticatetoken');
const isAdmin = require('../utilities/authorization');

const isCustomer = (req, res, next) => {
  if (req.user.role !== "customer") {
    return res.status(403).send({ message: 'Only customers are allowed to use this route' });
  }
  next();
};


route.post('/', authenticateUser, isCustomer, order.createOrder);
route.get('/',authenticateUser,isAdmin, order.getAllOrder);
route.get('/:id',authenticateUser,isAdmin, order.getOrderById);
route.patch('/:id',authenticateUser, isAdmin, order.updateShippingStatus);

module.exports = route;