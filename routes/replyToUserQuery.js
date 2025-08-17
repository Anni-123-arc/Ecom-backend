import mongoose from "mongoose";
import express from "express";
import userQuery from "../models/userQuery.js";

const replyToUserQueryRouter = express.Router();

replyToUserQueryRouter.post("/reply/:id", async (req, res) => {
  const id = req.params.id;
  const { reply } = req.body;

  try {
    // Use the correct field name from your schema
    const updatedQuery = await userQuery.findOneAndUpdate(
      { _id: id },
      { $set: { reply } },
      { new: true }
    );

    if (!updatedQuery) {
      return res.status(404).json({ message: "User query not found" });
    }

    console.log("Reply recorded");
    res.status(200).json({
      data: updatedQuery,
      message: "Reply recorded successfully",
    });
  } catch (error) {
    console.error("Error recording reply:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export { replyToUserQueryRouter };
