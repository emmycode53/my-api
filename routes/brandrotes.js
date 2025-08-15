const express = require('express')
const brand = require('../controller/brandcontroller');
const route = express.Router();

route.use('/', brand.addBrand);
route.use('/', brand.updateBrand);
route.use('/', brand.getBrands);
route.use('/', brand.deleteBrand);

module.exports = route;


