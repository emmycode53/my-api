const express = require('express')
const brand = require('../controller/brandcontroller');
const route = express.Router();
const authorizeUser = require('../utilities/authorization');
const  authenticateUser = require('../utilities/authenticatetoken');

route.post('/' , authenticateUser, authorizeUser, brand.addBrand);
route.put('/:id',authenticateUser ,authorizeUser, brand.updateBrand);
route.get('/', brand.getBrands);
route.delete('/:id' ,authenticateUser,authorizeUser, brand.deleteBrand);

module.exports = route;


