import express from 'express';
import Product from '../models/Product.js'; // Assuming you have a Product model defined


const getProductRoute = express.Router();

getProductRoute.get('/get-products' , async (req , res)=>{
    try {
        const data = await Product.find();
        res.status(200).json({
            data:data,
            message:"fetched products from DB"
        })

    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            message:"Internal server error"
        });
    }
})

export  {getProductRoute};