import express from 'express';
import { 
    listVideos, 
    addVideo, 
    removeVideo, 
    singleVideo, 
    toggleTrending, 
    listTrendingVideos,
    listUserVideos,
    updateVideo
} from '../controllers/videoController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const videoRouter = express.Router();

// Sadece admin erişimli rotalar
videoRouter.post('/add', 
    adminAuth, 
    upload.fields([
        { name: 'video', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 }
    ]), 
    addVideo
);
videoRouter.post('/remove', adminAuth, removeVideo);
videoRouter.post('/toggle-trending', adminAuth, toggleTrending);
videoRouter.post('/update', adminAuth, updateVideo);

// Genel erişimli rotalar
videoRouter.post('/single', singleVideo);
videoRouter.get('/list', listVideos);
videoRouter.get('/trending', listTrendingVideos);
videoRouter.get('/user/:userId', listUserVideos);

export default videoRouter;