// models/addressModel.js
import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  label: { type: String, default: "Home" },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  postalCode: { type: String },
  isDefault: { type: Boolean, default: false }
}, { timestamps: true });

export default AddressSchema;
