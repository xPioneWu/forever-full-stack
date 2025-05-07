import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { FaTrash, FaEdit, FaSync, FaPlus } from 'react-icons/fa';

const Products = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  console.log("Products component rendering");

  const fetchProducts = async () => {
    try {
      console.log("Fetching products from:", backendUrl + "/api/product/list");
      setLoading(true);
      setError(null);
      
      const response = await axios.get(backendUrl + "/api/product/list");
      console.log("API response:", response.data);
      
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        const errorMsg = response.data.message || "Ürünler yüklenirken bir hata oluştu";
        console.error("Error in product list response:", errorMsg);
        toast.error(errorMsg);
        setError(errorMsg);
      }
    } catch (error) {
      console.error("Product listing error:", error);
      const errorMsg = error.response?.data?.message || error.message || "Ürünler yüklenirken bir hata oluştu";
      toast.error(errorMsg);
      setError(errorMsg);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Product component mounted, fetching products");
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (e, productId) => {
    e.stopPropagation(); // Tıklamanın üst öğelere geçmesini engelleyin
    
    if (window.confirm("Bu ürünü silmek istediğinizden emin misiniz?")) {
      try {
        console.log("Deleting product with ID:", productId);
        
        const response = await axios.post(
          backendUrl + "/api/product/remove", 
          { productId }, 
          { headers: { token } }
        );
        
        if (response.data.success) {
          toast.success("Ürün başarıyla silindi");
          fetchProducts(); // Ürünleri yeniden yükle
        } else {
          toast.error(response.data.message || "Ürün silinirken bir hata oluştu");
        }
      } catch (error) {
        console.error("Product deletion error:", error);
        toast.error(error.response?.data?.message || "Ürün silinirken bir hata oluştu");
      }
    }
  };

  const navigateToProductDetail = (productId) => {
    console.log("Navigating to product detail:", productId);
    navigate(`/products/${productId}`);
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Ürünler</h1>
          <div className="flex gap-2">
            <button 
              onClick={fetchProducts} 
              className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              <FaSync />
              <span>Yeniden Dene</span>
            </button>
            <Link
              to="/add"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <FaPlus />
              <span>Yeni Ürün Ekle</span>
            </Link>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Ürünler yüklenirken bir hata oluştu</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ürünler</h1>
        <div className="flex gap-2">
          <button 
            onClick={fetchProducts} 
            className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition-colors"
            disabled={loading}
          >
            <FaSync className={`${loading ? 'animate-spin' : ''}`} size={14} />
            <span>Yenile</span>
          </button>
          <Link
            to="/add"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            <FaPlus />
            <span>Yeni Ürün Ekle</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : products.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {products.map((product) => (
              <div 
                key={product._id} 
                className='border rounded-lg p-4 hover:shadow-lg transition-shadow'
              >
                <div 
                  className='aspect-video mb-4 cursor-pointer' 
                  onClick={() => navigateToProductDetail(product._id)}
                >
                  <img 
                    src={product.image?.[0] || product.images?.[0] || 'https://via.placeholder.com/300x200'} 
                    alt={product.name}
                    className='w-full h-full object-cover rounded'
                  />
                </div>
                <h3 
                  className='font-semibold text-lg mb-2 cursor-pointer hover:text-blue-600' 
                  onClick={() => navigateToProductDetail(product._id)}
                >
                  {product.name}
                </h3>
                <p className='text-sm text-gray-600 mb-4 line-clamp-2'>{product.description}</p>
                <div className='flex justify-between items-center'>
                  <span className='font-medium text-gray-800'>{product.price} TL</span>
                  <div className='flex gap-2'>
                    <Link 
                      to={`/add?edit=${product._id}`} 
                      className='text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-full transition-colors'
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FaEdit />
                    </Link>
                    <button 
                      onClick={(e) => handleDeleteProduct(e, product._id)}
                      className='text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors'
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className='bg-white rounded-lg shadow-md p-8 text-center'>
          <p className='text-gray-600 mb-4'>Henüz hiç ürün bulunmamaktadır.</p>
          <Link
            to="/add"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors inline-block"
          >
            Yeni Ürün Ekle
          </Link>
        </div>
      )}
    </div>
  );
};

export default Products; 