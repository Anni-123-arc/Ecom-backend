import express from 'express';
import Product from '../models/Product.js';

const deleteProdRoute = express.Router();

deleteProdRoute.post('/delete-product/:id', async (req, res) => {
    const productID = req.params.id; // e.g., P1001

    try {
        // Check if product exists & delete
        const deletedProduct = await Product.findOneAndDelete({ Product_ID: productID });

        if (!deletedProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Get updated list after deletion
        const updatedData = await Product.find();

        res.status(200).json({
            data: updatedData,
            message: `Product '${productID}' deleted successfully`
        });

    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({
            message: "Error deleting product"
        });
    }
});

export { deleteProdRoute };
