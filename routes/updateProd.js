import express from 'express';
import Product from '../models/Product.js';

const updateProdRouter = express.Router();

updateProdRouter.post('/update-product', async (req, res) => {
    const { Product_ID, Product_Name, Category, Price, Quantity } = req.body;

    try {
        // Find the product by Product_ID and update it
        const updatedProduct = await Product.updateOne(
            { Product_ID }, // Match correct schema field
            {$set:{

                Price,
                Quantity
            }},
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            data: updatedProduct,
            message: `Product '${Product_ID}' updated successfully`
        });

    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({
            message: "Error updating product"
        });
    }
});

export { updateProdRouter };
