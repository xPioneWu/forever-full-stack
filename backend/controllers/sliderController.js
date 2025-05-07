import sliderModel from '../models/sliderModel.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// Tüm slider'ları getir
export const getAllSliders = async (req, res) => {
    try {
        const sliders = await sliderModel.find({ isActive: true }).sort({ order: 1 });
        res.json({ success: true, sliders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Yeni slider ekle
export const addSlider = async (req, res) => {
    try {
        const { title, description, link } = req.body;
        const image = req.file;

        if (!image) {
            return res.json({ success: false, message: "Lütfen bir resim yükleyin" });
        }

        const imageUrl = await uploadToCloudinary(image.path);

        const newSlider = new sliderModel({
            title,
            description,
            image: imageUrl,
            link
        });

        await newSlider.save();
        res.json({ success: true, message: "Slider başarıyla eklendi" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Slider güncelle
export const updateSlider = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, link, isActive, order } = req.body;
        const image = req.file;

        const updateData = {
            title,
            description,
            link,
            isActive,
            order
        };

        if (image) {
            const imageUrl = await uploadToCloudinary(image.path);
            updateData.image = imageUrl;
        }

        await sliderModel.findByIdAndUpdate(id, updateData);
        res.json({ success: true, message: "Slider başarıyla güncellendi" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Slider sil
export const deleteSlider = async (req, res) => {
    try {
        const { id } = req.params;
        await sliderModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Slider başarıyla silindi" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}; 