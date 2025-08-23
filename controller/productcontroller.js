const express = require('express');
const mongoose = require('mongoose')
const brandCollection = require('../schema/brandshema');


 const productSchema = require('../schema/productschema'); 
const { uploadSingleFile, uploadMultipleFiles } = require('../tigrisconfig'); 




const addProducts = async (req, res) => {
  try {

    const ownerId = req.user.userId
     console.log("➡️ ownerId being saved:", ownerId)
    const files = req.files;
    
    const { title, description, price, stockStatus, brandName} = req.body;

   const existingBrand = await brandCollection.findOne({brandName})
    if (!existingBrand) {
      return res.status(400).json({ message: 'Brand does not exist. Please add it first.' });
    }

    console.log("req.body:", req.body);

    if (!files || !title || !description || !price || !stockStatus || !brandName) {
      return res.status(400).json({ message: 'all fields are required' });
    }

     const imageUrls = await uploadMultipleFiles(files);

    const newProduct = new productSchema({
      title,
      description,
      price: Number(price),
      stockStatus,
      imageUrls,
      brand: existingBrand._id,
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
    
    const existingBrand = await brandCollection.findOne({ brandName: brand });
    if (!existingBrand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    
    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      populate: 'brand'
    };

    const result = await productSchema.paginate({ brand: existingBrand._id }, options);
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





