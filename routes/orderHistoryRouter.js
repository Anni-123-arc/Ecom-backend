import express from 'express';
import { dbConnection } from '../dbConnection.js';
import { Order } from '../models/orders.js';

const OrderHRoute = express.Router();

dbConnection();

OrderHRoute.get('/history/:email', async (req, res) => {
  const email = req.params.email;

  try {
    const orders = await Order.find({ email: email }); // await here!
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching order history', error: error.message });
  }
});

export { OrderHRoute };
