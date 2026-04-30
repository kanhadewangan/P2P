import express  from 'express'
import  Authentication  from '../middleware.js';
const router = express.Router();
import userRouter from './user.js';
import accountRouter from './account.js';
import route from './transaction.js';


router.use('/api/v1/user',userRouter);
router.use('/api/v1/account',Authentication,accountRouter);
router.use('/api/v1/transaction',Authentication,route)


export default router;

