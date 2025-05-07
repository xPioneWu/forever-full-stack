import express from 'express';
import userRouter from './userRoute.js';
import productRouter from './productRoute.js';
import cartRouter from './cartRoute.js';
import orderRouter from './orderRoute.js';
import videoRouter from './videoRoute.js';
import sliderRouter from './sliderRoute.js';
import categoryRouter from './categoryRoute.js';

const router = express.Router();

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'API Test Endpoint Working' });
});

// Routers
router.use('/user', userRouter);
router.use('/product', productRouter);
router.use('/cart', cartRouter);
router.use('/order', orderRouter);
router.use('/video', videoRouter);
router.use('/slider', sliderRouter);
router.use('/category', categoryRouter);

export default router; 