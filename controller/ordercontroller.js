const mongoose = require('mongoose');
const productModel = require('../schema/productschema');
const orderModel = require('../schema/order')


const createOrder = async (req,res)=>{
    try {
        const {item} = req.body;
        const customerId = req.user.userId;
        if(!item || item.length===0){
            return res.status(400).send({message:'order should at least contain one item'});
        }

        const orderedItems = await Promise.all(item.map (async (i)=>{
           const product= await productModel.findById(i.productId);
           if(!product){
            throw new Error(`product with ${i.productId} not found`)
           }
           return{
            productName : product.title,
            productId : i.productId,
            ownerId : req.user.userId,
            quantity : i.quantity,
            totalCost : product.price * i.quantity

           }
        }))

        const order = new  orderModel({
            customerId,
            item : orderedItems
           });
           await order.save();

           res.status(200).send({message:'order created successfully'});

    } catch (error) {
        console.error(error)
        res.status(500).send({meassage:'an error has occur',error: error.message})
    }
}

const getAllOrder = async (req, res) => {
  try {
    const orders = await orderModel.find()
      .populate('customerId', 'name email')        
      .populate('item.productId', 'productName price') 
      .populate('item.ownerId', 'name email');     

    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send({
      message: 'Error fetching orders',
      error: error.message,
    });
  }
};


const getOrderById = async (req, res) =>{
    try {
        const order = await orderModel.findById(req.params.id).populate('customerId', 'name email').populate('item.productId', 'title price');
        if(!order){
            return res.status(400).send({message: 'order not found'})
        }
        return res.status(200).send(order);
    } catch (error) {
       return res.status(500).send({message: 'error fetching order', error: error.message});
    }
};

const updateShippingStatus = async (req, res) => {
  try {
    const { shippingStatus } = req.body;

    
    if (!['pending', 'shipped', 'delivered'].includes(shippingStatus)) {
      return res.status(400).send({ message: 'Invalid status' });
    }

    const order = await orderModel.findById(req.params.id);
    if (!order) {
      return res.status(404).send({ message: 'Order not found' });
    }

    order.item = order.item.map(item => {
      item.shippingStatus = shippingStatus;
      return item;
    });

    await order.save();

    return res.status(200).send({ message: 'Status updated successfully' });
  } catch (error) {
    return res.status(500).send({
      message: 'Error occurred',
      error: error.message,
    });
  }
};


module.exports = {
    createOrder,
    getAllOrder,
    getOrderById,
    updateShippingStatus
}