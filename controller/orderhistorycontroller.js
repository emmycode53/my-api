const orderModel = require('../schema/order');
const orderHistory = async (req,res) =>{
  try {
    let orders;
    if( req.user.role === 'admin'){
     orders = await orderModel.find().populate('customerId', 'fullName email')
    } else if(req.user.role === 'customer'){
      orders = await orderModel.find({ customerId: req.user.userId }).populate('customerId', 'fullName email');

    } else{
      return res.status(403).send({message: 'unauthorized access'});
    }

    if(!orders || orders.length===0){
      res.status(404).send({message:'order not found'});
    };

    res.status(200).send({
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error( 'error fetching orders',error);
    res.status(500).send({message:'internal server error', error: error.message})
  }
};

module.exports = orderHistory