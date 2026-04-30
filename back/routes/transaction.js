import express from 'express';
import mongoose from 'mongoose';
import { Transaction, User } from '../db.js';

const route = express.Router();

route.post('/transaction', async (req, res) => {
    const fromId = req.userId;
    const {toId , amount} = req.body;

    try {
        const toAccount = await User.findById(toId);
        if(!toAccount) {
            return res.status(400).json({message: 'Invalid account'});
        }

        const updatedAccount = await User.findOneAndUpdate(
            { _id: fromId, balance: { $gte: amount } },
            { $inc: { balance: -amount } }
        );

        if(!updatedAccount) {
            return res.status(400).json({message: 'Insufficient balance'});
        }

        await User.findByIdAndUpdate(toId, {$inc: {balance: amount}});

        const transaction = new Transaction({
            fromUserId: fromId,
            toUserId: toId,
            amount: amount
        });
        await transaction.save();

        res.status(200).json({message: 'Transaction successful'});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'Internal server error'});
    }
});


route.get('/transactions', async (req, res) => {
    const id = req.userId;
    try {
        const transactions = await Transaction.find({$or: [{fromUserId: id}, {toUserId: id}]})
            .populate('fromUserId', 'firstname lastname email')
            .populate('toUserId', 'firstname lastname email')
            .sort({ timestamp: -1 });
        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json({message: 'Internal server error'});
    }
})

export default route;