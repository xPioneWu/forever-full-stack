import validator from "validator";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import userModel from "../models/userModel.js";


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

// Route for user login
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exists" })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {

            const token = createToken(user._id)
            res.json({ success: true, token })

        }
        else {
            res.json({ success: false, message: 'Invalid credentials' })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for user register
const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        // checking user already exists or not
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }

        // validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })

        const user = await newUser.save()

        const token = createToken(user._id)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for admin login
const adminLogin = async (req, res) => {
    try {
        
        const {email,password} = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+password,process.env.JWT_SECRET);
            res.json({success:true,token})
        } else {
            res.json({success:false,message:"Invalid credentials"})
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for getting user profile
const getUserProfile = async (req, res) => {
    try {
        // req.userId değerini token middleware'inden alıyoruz
        const userId = req.userId;
        
        if (!userId) {
            return res.json({ success: false, message: "Yetkilendirme hatası" });
        }
        
        // Şifre hariç kullanıcı bilgilerini getir
        const user = await userModel.findById(userId).select('-password');
        
        if (!user) {
            return res.json({ success: false, message: "Kullanıcı bulunamadı" });
        }
        
        res.json({ success: true, user });
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Route for updating user profile
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        
        if (!userId) {
            return res.json({ success: false, message: "Yetkilendirme hatası" });
        }
        
        const { name, address, phone, currentPassword, newPassword } = req.body;
        
        const user = await userModel.findById(userId);
        
        if (!user) {
            return res.json({ success: false, message: "Kullanıcı bulunamadı" });
        }
        
        // Şifre değişimi isteği varsa
        if (currentPassword && newPassword) {
            // Mevcut şifreyi kontrol et
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            
            if (!isMatch) {
                return res.json({ success: false, message: "Mevcut şifre yanlış" });
            }
            
            // Yeni şifreyi hash'le
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }
        
        // Diğer bilgileri güncelle
        if (name) user.name = name;
        if (address) user.address = address;
        if (phone) user.phone = phone;
        
        await user.save();
        
        res.json({ 
            success: true, 
            message: "Profil başarıyla güncellendi",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                address: user.address,
                phone: user.phone,
                isAdmin: user.isAdmin
            }
        });
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Route for getting all users (admin only)
const getAllUsers = async (req, res) => {
    try {
        // Admin kontrolü buraya eklenebilir
        
        const users = await userModel.find().select('-password');
        res.json({ success: true, users });
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


export { loginUser, registerUser, adminLogin, getUserProfile, updateUserProfile, getAllUsers }