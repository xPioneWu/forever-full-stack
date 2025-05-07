import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"

// function for add product
const addProduct = async (req, res) => {
    try {

        const { name, description, price, category, subCategory, sizes, bestseller } = req.body

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        if (images.length === 0) {
            return res.json({ success: false, message: "En az bir resim yüklemelisiniz" })
        }

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url
            })
        )

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            image: imagesUrl,
            date: Date.now()
        }

        console.log("Yeni ürün ekleniyor:", productData);

        const product = new productModel(productData);
        await product.save()

        res.json({ success: true, message: "Ürün Başarıyla Eklendi" })

    } catch (error) {
        console.log("Ürün ekleme hatası:", error)
        res.json({ success: false, message: error.message || "Ürün eklerken bir hata oluştu" })
    }
}

// function for list product
const listProducts = async (req, res) => {
    try {
        // Ürün yoksa örnek ürünler ekle
        const count = await productModel.countDocuments({});
        if (count === 0) {
            // Örnek ürünler oluştur
            const exampleProducts = [
                {
                    name: "Bambu Çatal Kaşık Seti",
                    description: "Doğal bambu malzemeden üretilmiş çevre dostu çatal kaşık seti.",
                    price: 150,
                    image: ["https://picsum.photos/400/400?random=1"],
                    category: "bambu",
                    subCategory: "mutfak",
                    sizes: ["standart"],
                    date: Date.now(),
                    bestseller: true
                },
                {
                    name: "Şef Bıçağı Set",
                    description: "Profesyonel mutfaklar için özel üretim şef bıçağı seti.",
                    price: 450,
                    image: ["https://picsum.photos/400/400?random=2"],
                    category: "bıçak",
                    subCategory: "mutfak",
                    sizes: ["standart"],
                    date: Date.now(),
                    bestseller: true
                },
                {
                    name: "Kristal Cam Bardak",
                    description: "El yapımı kristal cam bardak seti.",
                    price: 320,
                    image: ["https://picsum.photos/400/400?random=3"],
                    category: "cam",
                    subCategory: "ev",
                    sizes: ["standart"],
                    date: Date.now(),
                    bestseller: true
                },
                {
                    name: "Paslanmaz Çelik Tencere",
                    description: "Yüksek kalite paslanmaz çelik tencere seti.",
                    price: 780,
                    image: ["https://picsum.photos/400/400?random=4"],
                    category: "mutfak",
                    subCategory: "ev",
                    sizes: ["standart"],
                    date: Date.now(),
                    bestseller: true
                }
            ];
            
            await productModel.insertMany(exampleProducts);
            console.log("Örnek ürünler eklendi");
        }
        
        const products = await productModel.find({});
        console.log(`Toplam ${products.length} ürün bulundu`);
        res.json({success: true, products})

    } catch (error) {
        console.log("Ürün listeleme hatası:", error)
        res.json({ success: false, message: error.message || "Ürünler listelenirken bir hata oluştu" })
    }
}

// function for remove product
const removeProduct = async (req, res) => {
    try {
        // Ürün ID'sini productId veya id olarak kabul et
        const productId = req.body.productId || req.body.id;
        
        if (!productId) {
            return res.json({ success: false, message: "Ürün ID'si belirtilmemiş" });
        }
        
        console.log(`Ürün siliniyor. ID: ${productId}`);
        
        const result = await productModel.findByIdAndDelete(productId);
        
        if (!result) {
            return res.json({ success: false, message: "Ürün bulunamadı veya silinemedi" });
        }
        
        res.json({success: true, message: "Ürün Başarıyla Silindi"});

    } catch (error) {
        console.log("Ürün silme hatası:", error);
        res.json({ success: false, message: error.message || "Ürün silinirken bir hata oluştu" });
    }
}

// function for single product info
const singleProduct = async (req, res) => {
    try {
        // productId'yi POST veya URL parametrelerinden al
        const productId = req.body.productId || req.params.id;
        
        if (!productId) {
            return res.json({ success: false, message: "Ürün ID'si belirtilmemiş" });
        }
        
        console.log(`Ürün bilgileri alınıyor. ID: ${productId}`);
        
        const product = await productModel.findById(productId);
        
        if (!product) {
            return res.json({ success: false, message: "Ürün bulunamadı" });
        }
        
        res.json({success: true, product});

    } catch (error) {
        console.log("Ürün detayı hatası:", error);
        res.json({ success: false, message: error.message || "Ürün detayı alınırken bir hata oluştu" });
    }
}

// function for searching products
const searchProducts = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query || query.trim().length < 2) {
            return res.json({ success: false, message: "Arama sorgusu çok kısa", products: [] });
        }
        
        // Regex ile adı veya açıklaması sorguya uyan ürünleri bul
        const products = await productModel.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        }).limit(5).select('name _id'); // Yalnızca ad ve id bilgilerini döndür
        
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message, products: [] });
    }
};

export { listProducts, addProduct, removeProduct, singleProduct, searchProducts }