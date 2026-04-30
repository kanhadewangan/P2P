import express from 'express';
import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';
import cors from 'cors';
import router from './routes/index.js';

configDotenv();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:3001",
    "https://payfast-two.vercel.app"
  ]
}));

app.use(express.json());
app.use(router);

// ✅ Proper async connection with error handling
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

export default app; // ✅ Export for Vercel instead of app.listen()