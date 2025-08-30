require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const JWT = require('jsonwebtoken');
const app = express();
const {createServer} = require('http');
const {Server} = require('socket.io')
const productsRouts = require('./routes/productroutes');
const authRouts = require('./routes/authrouter');
const brandRoutes = require('./routes/brandrotes');
const orderRoutes = require('./routes/orderroutes');
const getProfileRoute = require('./routes/getprofileroute');
const getOrderHistoryRoutes = require('./routes/orderhistoryroutes');

const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
const httpServer = createServer(app);
const ioServer = new Server(httpServer, {cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }});

app.use(express.json())

app.use((req, res, next) => {
    req.io = ioServer;
    next();
});

app.use('/products', productsRouts);
app.use('/auth', authRouts);
app.use('/brands', brandRoutes);
app.use('/order',orderRoutes );
app.use('/order-history', getOrderHistoryRoutes);
app.use('/profile', getProfileRoute);





ioServer.on("connection", (socket) => {
  socket.on('join-room', (userId) => {
    socket.join(userId);
    console.log(`User ${socket.id} joined room: ${userId}`);
  });

  socket.on('order_shipping_status_update', (data, room) => {
      if(room !== ''){
          socket.to(room).emit('order_shipping_status_update', data);
      }
  });

  socket.on("disconnect", () => {
    console.log(`❌ User ${decoded.userId} disconnected`);
  });
});


mongoose.connect(process.env.MONGO_ATLAS_URL)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));




httpServer.listen(PORT, () => {
  console.log(` Server is running at http://localhost:${PORT}`);
});

module.exports = {ioServer};