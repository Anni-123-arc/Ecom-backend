import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  Product_ID: {
    type: String,
    required: true,
    unique: true
  },
  Product_Name: {
    type: String,
    required: true
  },
  Quantity: {
    type: Number,
    required: true
  },
  Price: {
    type: Number,
    required: true
  },
  Category:{
    type:String , 
    require:true
  },
  Image_URL: {
    type: String, // store path to the uploaded image
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Product', productSchema);
