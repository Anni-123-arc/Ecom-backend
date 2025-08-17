// controllers/addressController.js
import User from "../models/UserModel.js";

export const addAddress = async (req, res) => {
  try {
    const payload = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // if new address default -> unset others
    if (payload.isDefault) {
      user.addresses.forEach(a => a.isDefault = false);
    }

    user.addresses.push(payload);
    await user.save();
    return res.status(201).json({ addresses: user.addresses });
  } catch (err) {
    console.error("addAddress error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const updates = req.body;
    const user = await User.findById(req.user.id);
    const addr = user.addresses.id(addressId);
    if (!addr) return res.status(404).json({ message: "Address not found" });

    Object.assign(addr, updates);

    if (updates.isDefault) {
      user.addresses.forEach(a => { if (a._id.toString() !== addr._id.toString()) a.isDefault = false; });
    }

    await user.save();
    return res.json({ addresses: user.addresses });
  } catch (err) {
    console.error("updateAddress error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user.id);
    const addr = user.addresses.id(addressId);
    if (!addr) return res.status(404).json({ message: "Address not found" });

    addr.remove();
    await user.save();
    return res.json({ addresses: user.addresses });
  } catch (err) {
    console.error("deleteAddress error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const listAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    return res.json({ addresses: user.addresses });
  } catch (err) {
    console.error("listAddresses error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
