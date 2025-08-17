import express from 'express';
import { Order } from '../models/orders.js';
import { dbConnection } from '../dbConnection.js';

const orderRouter = express.Router();

// Ensure DB connection when this router is used
dbConnection();





orderRouter.get('/track/:orderID', async (req, res) => {
    const orderID = req.params.orderID;

    try {
        const orders = await Order.find({ orderID });

        if (orders.length === 0) {
            return res.status(404).json({ message: 'No order found with that ID' });
        }

        res.json({
            data:orders,
            message: 'Order fetched successfully',
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Server error while fetching order' });
    }
});

export { orderRouter };