const express = require('express');


 const productSchema = require('../schema/productschema'); 
const { uploadSingleFile, uploadMultipleFiles } = require('../tigrisconfig'); 

const addProducts = async (req, res) => {
  try {
    const files = req.files;
    const ownerId = req.user?.ownerId; 
    

    const { title, description, price, stockStatus} = req.body;

    console.log("req.body:", req.body);

    if (!files || !title || !description || !price || !stockStatus) {
      return res.status(400).json({ message: 'Title, description,price,stockStus and file are required' });
    }

     const imageUrls = await uploadMultipleFiles(files);

    const newProduct = new productSchema({
      title,
      description,
      price,
      stockStatus,
      imageUrls,
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
    const products = await productSchema.find();
    res.status(200).json({ message: 'All products retrieved', products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  addProducts,
  getAllProducts,
};





