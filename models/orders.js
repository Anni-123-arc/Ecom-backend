import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    orderID: { type: String, required: true },
    email: { type: String, required: true },
    productID: { type: String, required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    shippingAddress: { type: String, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    }
}, { collection: 'orders'});

export const Order = mongoose.model('Order', orderSchema);
