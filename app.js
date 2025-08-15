require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const app = express();
const productsRouts = require('./routes/productroutes');
const authRouts = require('./routes/authrouter');
const brandRoutes = require('./routes/brandrotes')

const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));

app.use(express.json())
app.use('/products', productsRouts);
app.use('/auth', authRouts);
app.use('/brands', brandRoutes);



mongoose.connect(process.env.MONGO_ATLAS_URL)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));




app.listen(PORT, () => {
  console.log(` Server is running at http://localhost:${PORT}`);
});
