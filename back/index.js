import express from 'express';
import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';
import cors from 'cors';
import router from './routes/index.js'
configDotenv();
const app = express();
app.use(cors({
  origin:"http://localhost:3001"|| "https://p2-p-ktp7-1vrusyyd2-kanhadewangans-projects.vercel.app"|| "https://payfast-two.vercel.app/"
}));

console.log(process.env.MONGO_URL);
const connectionDb = mongoose.connect(process.env.MONGO_URL);
if (connectionDb) {
  console.log('Connected to MongoDB');
}
else {
  process.exit(1);
}
app.use(express.json());
app.use(router);


app.listen(8080, () => {
  console.log('Server is running on port 8080');
});