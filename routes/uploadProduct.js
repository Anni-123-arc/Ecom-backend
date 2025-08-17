import express from 'express';
import multer from 'multer';
import path from 'path';
import Product from './../models/Product.js'; // Adjust the path as necessary


const uploadProductRoute = express.Router();


// Make uploads folder publicly accessible
uploadProductRoute.use('/uploads', express.static('uploads'));

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // images will be stored in uploads/
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// API to add product
uploadProductRoute.post('/Uploadproducts', upload.single('Image'), async (req, res) => {
  try {
    const { Product_ID, Product_Name, Quantity, Price, Category } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const newProduct = new Product({
      Product_ID,
      Product_Name,
      Quantity,
      Price,
      Category,
      Image_URL: `/uploads/${req.file.filename}` // store relative path
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', product: newProduct });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

export {uploadProductRoute};
