const mongoose = require('mongoose');
const brand = require('./brandshema');
const mongoosePaginate = require('mongoose-paginate-v2');


const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  imageUrls:{
    type : [String]
  },
  brand:{
    type : mongoose.Schema.Types.ObjectId,
    ref : 'Brands'
  },
  stoctStatus:{
   type : String 
  },

  ownerId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",   
  required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});
productSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Product', productSchema);
