import express from 'express'
const router = express.Router();
import { User } from '../db.js';


router.get('/balance',async (req,res)=>{
    try {
        const id = req.userId;
        const user = await User.findOne({_id: id});
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        res.status(200).json({balance: user.balance});
    } catch (err) {
        res.status(500).json({message: 'Internal server error'});
    }
});


router.post('/balance/:id',async(req,res)=>{
    try{
        const {id} = req.params;
        const userBalanceUpdate = await User.findByIdAndUpdate(id, {$inc: {balance: req.body.amount}}, {new: true});
        if(!userBalanceUpdate){
            return res.status(404).json({message: 'User not found'});
        }
        res.status(200).json({balance: userBalanceUpdate.balance});
    } catch (err) {
        res.status(500).json({message: 'Internal server error'});
    }
});


const accountRouter = router;
export default accountRouter;
