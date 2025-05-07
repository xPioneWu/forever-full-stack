import categoryModel from "../models/categoryModel.js";

// Kategori Ekleme
const addCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        // Kategori varlığını kontrol et
        const existingCategory = await categoryModel.findOne({ name });
        if (existingCategory) {
            return res.json({ success: false, message: "Bu kategori zaten mevcut." });
        }

        // Yeni kategori oluştur
        const categoryData = {
            name,
            description,
            date: Date.now()
        };

        const category = new categoryModel(categoryData);
        await category.save();

        res.json({ success: true, message: "Kategori başarıyla eklendi" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message || "Kategori eklenirken bir hata oluştu" });
    }
};

// Kategorileri Listeleme
const listCategories = async (req, res) => {
    try {
        // Örnek kategorileri oluştur (Henüz veritabanında kategori yoksa)
        const count = await categoryModel.countDocuments({});
        if (count === 0) {
            const defaultCategories = [
                { name: "bambu", description: "Doğal ve uzun ömürlü bambu ürünleri" },
                { name: "bıçak", description: "Profesyonel şeflerin tercih ettiği kaliteli bıçaklar" },
                { name: "cam", description: "Zarif cam ürünleri" },
                { name: "mutfak", description: "Modern ve fonksiyonel mutfak gereçleri" }
            ];
            
            await categoryModel.insertMany(defaultCategories);
        }
        
        const categories = await categoryModel.find({}).sort({ name: 1 });
        res.json({ success: true, categories });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message || "Kategoriler listelenirken bir hata oluştu" });
    }
};

// Kategori Silme
const removeCategory = async (req, res) => {
    try {
        const { categoryId } = req.body;
        await categoryModel.findByIdAndDelete(categoryId);
        res.json({ success: true, message: "Kategori başarıyla silindi" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message || "Kategori silinirken bir hata oluştu" });
    }
};

// Kategori Güncelleme
const updateCategory = async (req, res) => {
    try {
        const { id, name, description } = req.body;

        // Aynı isimde başka bir kategori var mı kontrol et
        const existingCategory = await categoryModel.findOne({ 
            name, 
            _id: { $ne: id } 
        });
        
        if (existingCategory) {
            return res.json({ success: false, message: "Bu kategori adı zaten kullanılıyor." });
        }

        await categoryModel.findByIdAndUpdate(id, {
            name,
            description
        });

        res.json({ success: true, message: "Kategori başarıyla güncellendi" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message || "Kategori güncellenirken bir hata oluştu" });
    }
};

export { addCategory, listCategories, removeCategory, updateCategory }; 