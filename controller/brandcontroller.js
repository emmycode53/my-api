const mongoose = require('mongoose');
const brandModel = require('../schema/brandshema');

addBrand = async (req, res) => {
  try {
    const { brandName } = req.body;
    const brand = await brandModel.create({ brandName });
    res.status(201).json(brand);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


updateBrand = async (req, res) => {
  try {
    const { brandName } = req.body;
    const updated = await brandModel.findByIdAndUpdate(req.params.id, { brandName }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Brand not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

getBrands = async (req, res) => {
  try {
    const brands = await brandModel.find();
    res.json(brands);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

deleteBrand = async (req, res) => {
try {
const brandId = req.param.id;
const brand = await brandModel.findById(brandId);
if(!brand){
return res.status(401).send({message:'brand not found'});
}
await ProductModel.deleteMany({brand:brandId});
await brandModel.findByIdAndDelete(brandId);
return res.status(201).send({message:'brand and products has been deleted'})
} catch (error) {
  console.error(error);
  res.status(500).send({error:'something went wrong'})
}
};

module.exports={
  addBrand,
  updateBrand,
  getBrands,
  deleteBrand
}