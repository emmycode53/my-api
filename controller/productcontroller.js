const express = require('express');


 const productSchema = require('../schema/productschema'); 
const { uploadSingleFile, uploadMultipleFiles } = require('../tigrisconfig'); 

const addProducts = async (req, res) => {
  try {
    const files = req.files;
    const ownerId = req.user?.ownerId; 
    console.log('➡️ Received files:', req.files);


    const { title, description, price, stockStatus, brand} = req.body;

    console.log("req.body:", req.body);

    if (!files || !title || !description || !price || !stockStatus || !brand) {
      return res.status(400).json({ message: 'brand,Title, description,price,stockStus and file are required' });
    }

     const imageUrls = await uploadMultipleFiles(files);

    const newProduct = new productSchema({
      title,
      description,
      price,
      stockStatus,
      imageUrls,
      brand,
      ownerId
    });

    await newProduct.save();

    res.status(201).json({ message: 'Product uploaded', imageUrls});
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await productSchema.find().populate('brand');
    res.status(200).json({ message: 'All products retrieved', products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



const getProductsByBrand = async (req, res) => {
  const { brand, page, limit } = req.params;
  try {
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      populate: 'brand'
    };

    const result = await productSchema.paginate({ brand }, options);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addProducts,
  getAllProducts,
  getProductsByBrand
};





