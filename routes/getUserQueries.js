import mongoose from "mongoose";
import express from "express";
import userQuery from "../models/userQuery.js";

const getQueryRouter = express.Router();

getQueryRouter.get('/getUserQueries', async (req, res) => {
  try {
    const queries = await userQuery.find({reply:""}).sort({ userQueryDate: -1 });
    res.status(200).json({ data: queries });
  } catch (error) {
    console.error("Error fetching user queries:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export  {getQueryRouter};