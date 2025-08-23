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

        
    const orderedItems = await Promise.all(
      item.map(async (i) => {
        

        let product;


if (i.productId) {
  product = await productModel.findById(i.productId);
} else if (i.productName) {
  const productName = i.productName?.trim();
  product = await productModel.findOne({ 
    title: { $regex: new RegExp(`^${productName}$`, 'i') } 
  });
}
console.log('Fetched product:', product);
console.log('product.ownerId:', product.ownerId);

if (!product) {
  throw new Error(`Product not found: ${i.productId || i.productName}`);
}

  return {
          productName: product.title,
          productId: product._id,     
          ownerId: product.ownerId,   
          quantity: i.quantity,
          totalCost: product.price * i.quantity
         };

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
    const rawOrders = await orderModel.find();
    console.log("➡️ Raw orders from DB:", JSON.stringify(rawOrders, null, 2));
    const orders = await orderModel.find().populate('customerId', 'fullName email').populate('item.productId', 'title price')
  //     const orders = await orderModel.find()
  // .populate({
  //   path: 'customerId',
  //   select: 'fullName email'
  // })
  // .populate({
  //   path: 'item.productId',
  //   select: 'title price'
  // })
  // .populate({
  //   path: 'item.ownerId',
  //   select: 'fullName email'
  // });

      
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