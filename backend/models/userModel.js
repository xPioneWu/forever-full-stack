import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    profilePic: { type: String, default: '' },
    isAdmin: { type: Boolean, default: false },
    cartData: { type: Object, default: {} },
    createdAt: { type: Date, default: Date.now }
}, { minimize: false })

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel