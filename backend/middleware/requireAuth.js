import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const requireAuth = async (req, res, next) => {
    try {
        // Token doğrulama
        const { token } = req.headers;

        if (!token) {
            return res.status(401).json({ success: false, message: 'Yetkilendirme gerekli' });
        }

        // Token'ı doğrula
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Admin token'ı mı?
        if (typeof decoded === 'string') {
            // Admin token'ı için özel kontrol
            if (decoded.includes(process.env.ADMIN_EMAIL)) {
                req.isAdmin = true;
                return next();
            }
            return res.status(401).json({ success: false, message: 'Geçersiz token' });
        }

        // Kullanıcı token'ı ise ID'yi çıkar
        const { id } = decoded;
        
        // Kullanıcıyı bul (şifresiz)
        const user = await userModel.findById(id).select('-password');
        
        if (!user) {
            return res.status(401).json({ success: false, message: 'Geçersiz token, kullanıcı bulunamadı' });
        }
        
        // Kullanıcı ID'sini request objesine ekle
        req.userId = user._id;
        req.isAdmin = user.isAdmin;
        
        next();
    } catch (error) {
        console.log('Auth error:', error.message);
        res.status(401).json({ success: false, message: 'Geçersiz token' });
    }
};

export default requireAuth; 