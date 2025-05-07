import express from 'express';
import { getAllSliders, addSlider, updateSlider, deleteSlider } from '../controllers/sliderController.js';
import adminAuth from '../middleware/adminAuth.js';
import multer from 'multer';

const router = express.Router();

// Multer ayarları
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Public routes
router.get('/list', getAllSliders);

// Admin routes
router.post('/add', adminAuth, upload.single('image'), addSlider);
router.put('/update/:id', adminAuth, upload.single('image'), updateSlider);
router.delete('/delete/:id', adminAuth, deleteSlider);

export default router; 