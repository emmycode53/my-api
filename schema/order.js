
const mongoose = require('mongoose');

const itemsSchema =new mongoose.Schema({
    productName : {
        type : String,
        required : true
    },
    productId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Product',
        required:true
    },
    ownerId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user',
        required : true
    },
    quantity :{
        type : Number,
        required : true
    },
    totalCost :{
        type : Number,
        required: true
    },
    shippingStatus :{
        type : String,
        enum: ['pendin', 'shipped', 'delivered'],
        default : 'pending'
    }

});

const orderSchema = new mongoose.Schema({
    customerId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user',
        required : true
    },
    item : [itemsSchema],
    createdAt :{
        type : Date,
        default : Date.now
    }
});

module.exports = mongoose.model('order', orderSchema);