import express from 'express';
import 'dotenv/config';
import connectDB from './database/db.js';
import authRoutes from './routes/authRoutes.js';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const app = express();
const PORT = 8000; // Force match with Frontend

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);
// Connect to DB then Start Server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server strictly running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error("Database connection failed", err);
});