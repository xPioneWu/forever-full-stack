import express from 'express';
import { addCategory, listCategories, removeCategory, updateCategory } from '../controllers/categoryController.js';
import adminAuth from '../middleware/adminAuth.js';

const categoryRouter = express.Router();

// Admin gerektiren rotalar
categoryRouter.post('/add', adminAuth, addCategory);
categoryRouter.post('/remove', adminAuth, removeCategory);
categoryRouter.post('/update', adminAuth, updateCategory);

// Herkese açık rotalar
categoryRouter.get('/list', listCategories);

export default categoryRouter; 