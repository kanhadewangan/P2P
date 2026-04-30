import express from 'express';
import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';
configDotenv();

const Authentication = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        console.log(authHeader);
        if (!authHeader) {
            return res.json({
                message: "Unauthorized"
            })
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.json({
                message: "Unauthorized - Invalid token format"
            })
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decode.id
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

}


export default Authentication;