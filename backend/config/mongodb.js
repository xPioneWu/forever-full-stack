import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB bağlantısı başarılı');
        
        // Veritabanındaki video koleksiyonunu kontrol edelim
        const videoCount = await mongoose.connection.collection('videos').countDocuments();
        console.log('Toplam video sayısı:', videoCount);
        
    } catch (error) {
        console.error('MongoDB bağlantı hatası:', error);
        process.exit(1);
    }
};

export default connectDB;