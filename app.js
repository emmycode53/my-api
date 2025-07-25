const express = require('express')
require('dotenv').config();
const mongoose = require('mongoose')
const app = express()
const auth = require('./routes/authrouter');
const productsRouts = require('./routes/productroutes')
const authRouts = require('./routes/authrouter');

const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));

app.use(express.json())
app.use('/products', productsRouts);
app.use('/auth', authRouts);



mongoose.connect(process.env.mogoatlas_url)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));




app.listen(PORT, () => {
  console.log(` Server is running at http://localhost:${PORT}`);
});
