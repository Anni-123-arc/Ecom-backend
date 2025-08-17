import express from 'express';
import UserQuery from '../models/userQuery.js';

const sendMsg = express.Router();

sendMsg.post('/sendQuery', async (req, res) => {
    const { userMessage } = req.body;

    // Input validation
    if (!userMessage || typeof userMessage !== 'string' || userMessage.trim() === '') {
        return res.status(400).json({
            success: false,
            message: 'Invalid message content'
        });
    }

    try {
        // Create and save new query
        const newQuery = new UserQuery({
            userMessage: userMessage.trim(),
            createdAt: new Date()
        });

        const savedQuery = await newQuery.save();

        // Get all queries (consider adding pagination for production)
        const queries = await UserQuery.find().sort({ createdAt: -1 });

        res.status(201).json({
            success: true,
            message: 'Query sent successfully',
            data: {
                newQuery: savedQuery,
                allQueries: queries
            }
        });

    } catch (error) {
        console.error('Error processing query:', error);
        res.status(500).json({
            success: false,
            message: 'oops something went wrong',
            
        });
    }
});

export { sendMsg };