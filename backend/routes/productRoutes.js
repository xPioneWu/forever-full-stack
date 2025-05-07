import express from 'express';
import { addProduct, listProducts, removeProduct, singleProduct, searchProducts } from '../controllers/productController.js';
import upload from '../middlewares/multer.js';
import { adminAuth, requireAuth } from '../middlewares/auth.js';

const productRouter = express.Router();

productRouter.post('/add', adminAuth, upload.array('images', 5), addProduct);
productRouter.post('/remove', adminAuth, removeProduct);
productRouter.post('/single', singleProduct);
productRouter.get('/list', listProducts);
productRouter.get('/search', searchProducts);

export default productRouter; 