import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import productRoutes from './routes/productRoutes.js';
import deliveryRoutes from './routes/deliveryRoutes.js';
import userInfoRoutes from './routes/userInfoRoutes.js';
import cors from "cors"
dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/products', productRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/userinfo', userInfoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
