const express = require('express')
const brand = require('../controller/brandcontroller');
const route = express.Router();

route.post('/', brand.addBrand);
route.put('/', brand.updateBrand);
route.get('/', brand.getBrands);
route.delete('/', brand.deleteBrand);

module.exports = route;


