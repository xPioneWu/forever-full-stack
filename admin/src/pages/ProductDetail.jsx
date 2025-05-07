import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';

const ProductDetail = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  console.log("ProductDetail component rendering, id:", id);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("Ürün ID'si bulunamadı");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching product details from:", `${backendUrl}/api/product/single/${id}`);
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`${backendUrl}/api/product/single/${id}`);
        console.log("API response:", response.data);
        
        if (response.data.success) {
          setProduct(response.data.product);
        } else {
          const errorMsg = response.data.message || "Ürün yüklenirken bir hata oluştu";
          console.error("Error in product detail response:", errorMsg);
          setError(errorMsg);
          toast.error(errorMsg);
        }
      } catch (error) {
        console.error("Product detail loading error:", error);
        const errorMsg = error.response?.data?.message || error.message || "Ürün yüklenirken bir hata oluştu";
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleDeleteProduct = async () => {
    if (window.confirm("Bu ürünü silmek istediğinizden emin misiniz?")) {
      try {
        console.log("Deleting product with ID:", id);
        
        const response = await axios.post(
          backendUrl + "/api/product/remove", 
          { productId: id }, 
          { headers: { token } }
        );
        
        if (response.data.success) {
          toast.success("Ürün başarıyla silindi");
          navigate('/products');
        } else {
          toast.error(response.data.message || "Ürün silinirken bir hata oluştu");
        }
      } catch (error) {
        console.error("Product deletion error:", error);
        toast.error(error.response?.data?.message || "Ürün silinirken bir hata oluştu");
      }
    }
  };
  
  const handleEditProduct = () => {
    console.log("Editing product with ID:", id);
    navigate(`/add?edit=${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Link 
            to="/products" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Ürünlere Dön
          </Link>
        </div>
        
        <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <FaExclamationTriangle size={24} />
            <h2 className="text-xl font-semibold">Ürün Yüklenirken Hata Oluştu</h2>
          </div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Ürün Bulunamadı</h2>
          <p className="text-gray-600 mb-6">Aradığınız ürün mevcut değil veya silinmiş olabilir.</p>
          <Link 
            to="/products" 
            className="inline-flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Ürünlere Dön
          </Link>
        </div>
      </div>
    );
  }

  // Resim URL'lerinin varlığını ve formatını kontrol et
  const images = Array.isArray(product.images) ? product.images : 
                Array.isArray(product.image) ? product.image : 
                [];

  // Güvenli erişim için kontrol et
  const imageToShow = images.length > activeImage ? images[activeImage] : null;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <Link 
          to="/products" 
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Ürünlere Dön
        </Link>
        <div className="flex gap-2">
          <button 
            onClick={handleEditProduct}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <FaEdit /> Düzenle
          </button>
          <button 
            onClick={handleDeleteProduct}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors flex items-center gap-2"
          >
            <FaTrash /> Sil
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Sol Taraf - Resim Galerisi */}
          <div>
            <div className="aspect-square mb-4 bg-gray-100 rounded overflow-hidden">
              {imageToShow ? (
                <img 
                  src={imageToShow} 
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Resim yok
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <div 
                    key={index} 
                    onClick={() => setActiveImage(index)}
                    className={`aspect-square rounded overflow-hidden cursor-pointer border-2 ${
                      activeImage === index ? 'border-blue-500' : 'border-transparent'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sağ Taraf - Ürün Detayları */}
          <div>
            <h1 className="text-2xl font-bold mb-2">{product.name || 'İsimsiz Ürün'}</h1>
            <p className="text-3xl font-semibold mb-6 text-blue-600">{product.price || 0} {currency}</p>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Ürün Bilgileri</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Kategori</p>
                  <p className="font-medium">{product.category || 'Belirtilmemiş'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Alt Kategori</p>
                  <p className="font-medium">{product.subCategory || 'Belirtilmemiş'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Çok Satan</p>
                  <p className="font-medium">{product.bestseller ? 'Evet' : 'Hayır'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Stok Durumu</p>
                  <p className="font-medium">
                    {product.stock > 0 ? `${product.stock} adet` : 'Stokta Yok'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Açıklama</h2>
              <p className="text-gray-700 whitespace-pre-line">{product.description || 'Açıklama bulunmuyor'}</p>
            </div>

            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Bedenler</h2>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 border rounded text-sm font-medium"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 