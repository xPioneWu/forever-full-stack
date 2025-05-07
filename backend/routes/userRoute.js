import express from 'express';
import { 
    loginUser, 
    registerUser, 
    adminLogin, 
    getUserProfile, 
    updateUserProfile, 
    getAllUsers 
} from '../controllers/userController.js';
import requireAuth from '../middleware/requireAuth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);

// Profil işlemleri
userRouter.get('/profile', requireAuth, getUserProfile);
userRouter.post('/update-profile', requireAuth, updateUserProfile);

// Admin işlemleri
userRouter.get('/list', getAllUsers);

export default userRouter;