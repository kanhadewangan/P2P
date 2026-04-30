import express from 'express';
import {User} from '../db.js'
import jwt from 'jsonwebtoken';

const router = express.Router();



router.post('/signup',async (req,res)=>{
   
   try {
    const {email, password,firstname,lastname} = req.body;
    const user = await User.create({email, password,firstname,lastname});
    res.status(201).json(user);
   } catch (err) {
    console.log(err)
    res.status(500).json({message: 'Internal server error'});
   }
})


router.post('/login',async (req,res)=>{
     try {
        const  {email, password} = req.body;
        const findUser  = await User.findOne({email})
        if(!findUser){
            return res.status(404).json({message: 'User not found'})
        }
        if(findUser.password !== password){
            return res.status(401).json({message: 'Invalid password'})
        }
        const token =  jwt.sign({id: findUser._id}, process.env.JWT_SECRET);
        res.status(200).json({message: 'Login successful', token});
    }
    catch(err){
        console.log(err)
        res.status(500).json({message: 'Internal server error'})
    }
})


router.put('/update',async (req,res)=>{
    try {
        const {id} = req.query;
        const {email, password,firstName,lastName} = req.body;
        const user = await User.findByIdAndUpdate(id,{email, password,firstName,lastName},{new: true});
        if(!user){
            return res.status(404).json({message: 'User not found'})
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({message: 'Internal server error'})
    }
})

router.get('/bulk',async (req,res)=>{
    const {filter} = req.query;
    const users = await User.find(filter);
    if(users.length === 0){
        return res.status(404).json({message: 'User not found'})
    }
    res.status(200).json(users);
})

const userRouter = router;
export default userRouter;