// const express = require('express');
// const productRoutes = express.Router();
// const products = require('../controller/productcontroller');
// const authorizeUsers = require('../utilities/authorization')
// const multer = require('multer');
// const upload = multer({ storage: multer.memoryStorage() });


// productRoutes.get('uploaus',authorizeUsers,upload.single('file'),products.getAllProducts);


// productRoutes.get('products',products.addProducts);



// module.exports = productRoutes;

const express = require('express');
const productRoutes = express.Router();
const products = require('../controller/productcontroller');
const authorizeUsers = require('../utilities/authorization');
const authenticateUser = require('../utilities/authenticatetoken')
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });



productRoutes.get('/', products.getAllProducts);


productRoutes.post('/',authenticateUser,authorizeUsers,  upload.array('files'), products.addProducts);

productRoutes.get('/:brand/:page/:limit', products.getProductsByBrand);

module.exports = productRoutes;
