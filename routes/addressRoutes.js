// routes/addressRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addAddress, updateAddress, deleteAddress, listAddresses } from "../controllers/addressController.js";

const router = express.Router();

router.get("/", protect, listAddresses);
router.post("/", protect, addAddress);
router.put("/:addressId", protect, updateAddress);
router.delete("/:addressId", protect, deleteAddress);

export default router;
