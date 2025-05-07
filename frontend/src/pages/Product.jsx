import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import { FaStar, FaRegStar, FaHeart, FaShoppingCart, FaShare, FaShieldAlt, FaTruck, FaUndo } from 'react-icons/fa';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0]);
        setLoading(false);
        return null;
      }
      return null;
    });
  }

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  const handleAddToCart = () => {
    addToCart(productData._id, size);
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return productData ? (
    <div className='min-h-screen bg-gray-50 pt-8 pb-12 transition-opacity ease-in duration-500 opacity-100'>
      <div className='container mx-auto px-4'>
        {/* Ürün Detayları */}
        <div className='bg-white rounded-xl shadow-sm overflow-hidden p-8'>
          <div className='flex flex-col md:flex-row gap-8'>
            {/* Ürün Görselleri */}
            <div className='flex-1 flex flex-col-reverse md:flex-row gap-4'>
              {/* Küçük Önizleme Resimleri */}
              <div className='flex md:flex-col overflow-x-auto md:overflow-y-auto gap-3 justify-between md:justify-start md:w-[100px] w-full'>
                {productData.image.map((item, index) => (
                  <div 
                    key={index} 
                    onClick={() => setImage(item)} 
                    className={`w-[80px] h-[80px] cursor-pointer rounded-md overflow-hidden border-2 flex-shrink-0 transition-all ${image === item ? 'border-indigo-500 shadow-md' : 'border-gray-200'}`}
                  >
                    <img 
                      src={item} 
                      className='w-full h-full object-cover' 
                      alt={`${productData.name} - görsel ${index + 1}`} 
                    />
                  </div>
                ))}
              </div>
              
              {/* Ana Ürün Görseli */}
              <div className='w-full md:w-[calc(100%-100px)] h-[400px] md:h-[500px] rounded-xl overflow-hidden'>
                <img 
                  className='w-full h-full object-contain' 
                  src={image} 
                  alt={productData.name} 
                />
              </div>
            </div>

            {/* Ürün Bilgileri */}
            <div className='flex-1'>
              <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-2'>{productData.name}</h1>
              
              {/* Yıldızlar */}
              <div className='flex items-center gap-1 my-3'>
                <FaStar className='text-yellow-400' />
                <FaStar className='text-yellow-400' />
                <FaStar className='text-yellow-400' />
                <FaStar className='text-yellow-400' />
                <FaRegStar className='text-yellow-400' />
                <p className='pl-2 text-gray-600'>(122 değerlendirme)</p>
              </div>
              
              {/* Fiyat */}
              <div className='mt-4'>
                <p className='text-3xl font-semibold text-indigo-600'>{currency}{productData.price}</p>
                <p className='text-sm text-gray-500 mt-1'>KDV Dahil</p>
              </div>
              
              {/* Açıklama */}
              <div className='mt-6'>
                <p className='text-gray-700'>{productData.description}</p>
              </div>
              
              {/* Boyut Seçimi */}
              <div className='mt-8'>
                <p className='text-gray-700 font-medium mb-3'>Boyut Seçin (İsteğe Bağlı)</p>
                <div className='flex flex-wrap gap-3'>
                  {productData.sizes.map((item, index) => (
                    <button 
                      key={index} 
                      onClick={() => setSize(item)}
                      className={`px-4 py-2 rounded-md transition-all ${
                        item === size 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Miktar Ayarı */}
              <div className='mt-8'>
                <p className='text-gray-700 font-medium mb-3'>Miktar</p>
                <div className='flex items-center gap-4'>
                  <div className='flex items-center'>
                    <button 
                      onClick={decreaseQuantity}
                      className='w-10 h-10 bg-gray-100 rounded-l-md flex items-center justify-center hover:bg-gray-200'
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className='w-12 h-10 text-center border-y border-gray-200 outline-none'
                    />
                    <button 
                      onClick={increaseQuantity}
                      className='w-10 h-10 bg-gray-100 rounded-r-md flex items-center justify-center hover:bg-gray-200'
                    >
                      +
                    </button>
                  </div>
                  <p className='text-gray-500 text-sm'>Stokta: {Math.floor(Math.random() * 50) + 5} adet</p>
                </div>
              </div>
              
              {/* Butonlar */}
              <div className='mt-8 flex flex-wrap gap-4'>
                <button 
                  onClick={handleAddToCart} 
                  className='flex-1 min-w-[150px] bg-indigo-600 text-white py-3 px-6 rounded-md font-medium flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors'
                >
                  <FaShoppingCart />
                  SEPETE EKLE
                </button>
                <button className='w-12 h-12 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50'>
                  <FaHeart className='text-gray-400 hover:text-red-500' />
                </button>
                <button className='w-12 h-12 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50'>
                  <FaShare className='text-gray-400' />
                </button>
              </div>
              
              {/* Özellikler */}
              <div className='mt-8 border-t border-gray-200 pt-6'>
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                  <div className='flex items-center gap-3'>
                    <FaShieldAlt className='text-indigo-500 text-xl' />
                    <div>
                      <p className='text-sm font-medium'>%100 Orijinal Ürün</p>
                      <p className='text-xs text-gray-500'>Güvenli Alışveriş</p>
                    </div>
                  </div>
                  <div className='flex items-center gap-3'>
                    <FaTruck className='text-indigo-500 text-xl' />
                    <div>
                      <p className='text-sm font-medium'>Kapıda Ödeme İmkanı</p>
                      <p className='text-xs text-gray-500'>Nakit veya Kart</p>
                    </div>
                  </div>
                  <div className='flex items-center gap-3'>
                    <FaUndo className='text-indigo-500 text-xl' />
                    <div>
                      <p className='text-sm font-medium'>7 Gün İade Garantisi</p>
                      <p className='text-xs text-gray-500'>Kolay İade İmkanı</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Açıklama ve İncelemeler Bölümü */}
        <div className='mt-12 bg-white rounded-xl shadow-sm overflow-hidden'>
          {/* Sekmeler */}
          <div className='flex border-b'>
            <button 
              onClick={() => setActiveTab('description')}
              className={`px-6 py-4 font-medium text-sm transition-all ${
                activeTab === 'description'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Ürün Açıklaması
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-4 font-medium text-sm transition-all ${
                activeTab === 'reviews'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Değerlendirmeler (122)
            </button>
          </div>
          
          {/* Sekme İçeriği */}
          <div className='p-6'>
            {activeTab === 'description' ? (
              <div className='text-gray-700 space-y-4'>
                <p>Yüksek kaliteli ve dayanıklı malzemelerden üretilen bu ürün, uzun ömürlü kullanım için tasarlanmıştır. Estetik görünümü ve işlevselliği ile yaşam alanlarınıza değer katar.</p>
                <p>Modern tasarımı ve pratik kullanımı sayesinde günlük hayatınızı kolaylaştırır. Kolay temizlenebilir yapısı ile bakımı oldukça zahmetsizdir.</p>
              </div>
            ) : (
              <div className='text-gray-700'>
                <p className='text-center text-gray-500 py-8'>Bu ürüne henüz değerlendirme yapılmamış, ilk değerlendirmeyi sen yap!</p>
              </div>
            )}
          </div>
        </div>

        {/* Benzer Ürünler */}
        <div className='mt-12'>
          <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
        </div>
      </div>
    </div>
  ) : (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin'></div>
    </div>
  );
}

export default Product;
