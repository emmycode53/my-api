const mongoose = require('mongoose');

const brandschema = mongoose.Schema({
    brandName :{
        type : String,
        required: true,
        unique : true
    }
});

const Brands = mongoose.model('Brands', brandschema);
module.exports = Brands