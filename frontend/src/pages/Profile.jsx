import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUser, FaSave, FaSpinner, FaBoxOpen, FaHome, FaCreditCard } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
  const { token, backendUrl } = useContext(ShopContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState({
    name: '',
    email: '',
    profilePic: ''
  });
  
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    newPassword: '',
    confirmPassword: '',
    address: '',
    phone: ''
  });

  const [orders, setOrders] = useState([]);
  const [orderLoading, setOrderLoading] = useState(false);

  const navigate = useNavigate();

  // Kullanıcı bilgilerini yükle
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { token }
      });
      
      if (response.data.success) {
        const userData = response.data.user;
        setUser(userData);
        setFormData(prev => ({
          ...prev,
          name: userData.name || '',
          address: userData.address || '',
          phone: userData.phone || ''
        }));
      } else {
        toast.error(response.data.message || "Profil bilgileri yüklenirken bir hata oluştu");
      }
    } catch (error) {
      console.error("Profil bilgileri yükleme hatası:", error);
      toast.error("Profil bilgileri yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  // Siparişleri yükle
  const fetchOrders = async () => {
    if (activeTab !== 'orders' || !token) return;
    
    try {
      setOrderLoading(true);
      const response = await axios.get(`${backendUrl}/api/order/user-orders`, {
        headers: { token }
      });
      
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message || "Siparişler yüklenirken bir hata oluştu");
      }
    } catch (error) {
      console.error("Sipariş listeleme hatası:", error);
      toast.error("Siparişler yüklenirken bir hata oluştu");
    } finally {
      setOrderLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    } else {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  // Form değişikliklerini işle
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Profil güncelleme
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Şifre değiştirme kontrolü
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        return toast.error("Yeni şifreler eşleşmiyor");
      }
      
      if (!formData.password) {
        return toast.error("Mevcut şifrenizi girmelisiniz");
      }
    }
    
    try {
      setSaving(true);
      
      // Gönderilecek verileri hazırla
      const updateData = {
        name: formData.name,
        address: formData.address,
        phone: formData.phone
      };
      
      // Şifre değişikliği varsa ekle
      if (formData.newPassword && formData.password) {
        updateData.currentPassword = formData.password;
        updateData.newPassword = formData.newPassword;
      }
      
      const response = await axios.post(
        `${backendUrl}/api/user/update-profile`,
        updateData,
        { headers: { token } }
      );
      
      if (response.data.success) {
        toast.success("Profil başarıyla güncellendi");
        // Şifre alanlarını temizle
        setFormData(prev => ({
          ...prev,
          password: '',
          newPassword: '',
          confirmPassword: ''
        }));
        
        // Profil bilgilerini yeniden yükle
        fetchUserProfile();
      } else {
        toast.error(response.data.message || "Profil güncellenemedi");
      }
    } catch (error) {
      console.error("Profil güncelleme hatası:", error);
      toast.error(error.response?.data?.message || "Profil güncellenirken bir hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  // Sipariş durumu formatı
  const formatOrderStatus = (status) => {
    switch(status) {
      case 'pending': return 'Beklemede';
      case 'processing': return 'İşleniyor';
      case 'shipped': return 'Kargoya Verildi';
      case 'delivered': return 'Teslim Edildi';
      case 'cancelled': return 'İptal Edildi';
      default: return 'Bilinmiyor';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">Hesabım</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sol taraf - Menü */}
        <div className="w-full lg:w-1/4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 bg-indigo-50 border-b">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                  {user.profilePic ? (
                    <img src={user.profilePic} alt="Profil" className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <FaUser className="text-indigo-500" size={24} />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-800">{user.name || 'Hoş Geldiniz'}</h2>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>
            
            <div className="p-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3 rounded-md flex items-center gap-3 transition-colors ${
                  activeTab === 'profile' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-50'
                }`}
              >
                <FaUser className={activeTab === 'profile' ? 'text-indigo-600' : 'text-gray-500'} />
                <span>Profilim</span>
              </button>
              
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-4 py-3 rounded-md flex items-center gap-3 transition-colors ${
                  activeTab === 'orders' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-50'
                }`}
              >
                <FaBoxOpen className={activeTab === 'orders' ? 'text-indigo-600' : 'text-gray-500'} />
                <span>Siparişlerim</span>
              </button>
              
              <button
                onClick={() => setActiveTab('address')}
                className={`w-full text-left px-4 py-3 rounded-md flex items-center gap-3 transition-colors ${
                  activeTab === 'address' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-50'
                }`}
              >
                <FaHome className={activeTab === 'address' ? 'text-indigo-600' : 'text-gray-500'} />
                <span>Adres Bilgilerim</span>
              </button>
            </div>
          </div>
          
          <div className="mt-6">
            <Link 
              to="/"
              className="bg-gray-100 text-gray-700 w-full block text-center py-3 rounded-md hover:bg-gray-200 transition-colors"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
        
        {/* Sağ taraf - İçerik */}
        <div className="w-full lg:w-3/4">
          {/* Profil Bilgileri */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Profil Bilgilerim</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Ad Soyad
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ad Soyad"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      E-posta
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={user.email}
                      disabled
                      className="w-full px-3 py-2 border bg-gray-50 rounded-md text-gray-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">E-posta adresi değiştirilemez</p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Şifre Değiştir</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Mevcut Şifre
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Mevcut şifrenizi girin"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Yeni Şifre
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Yeni şifrenizi girin"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Yeni Şifre (Tekrar)
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Yeni şifrenizi tekrar girin"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700 transition-colors"
                  >
                    {saving ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        <span>Kaydediliyor...</span>
                      </>
                    ) : (
                      <>
                        <FaSave />
                        <span>Değişiklikleri Kaydet</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Siparişler */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Siparişlerim</h2>
              
              {orderLoading ? (
                <div className="flex justify-center items-center h-48">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order._id} className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div>
                          <span className="text-xs text-gray-500">Sipariş No: {order._id}</span>
                          <p className="text-sm font-medium mt-1">
                            {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="mt-2 sm:mt-0">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {formatOrderStatus(order.status)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="space-y-4">
                          {order.products.map((product, index) => (
                            <div key={index} className="flex items-center">
                              <div className="h-16 w-16 flex-shrink-0 bg-gray-100 rounded">
                                {product.image && (
                                  <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    className="h-full w-full object-cover object-center rounded"
                                  />
                                )}
                              </div>
                              <div className="ml-4 flex-1">
                                <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                                <p className="text-xs text-gray-500 mt-1">Adet: {product.quantity}</p>
                              </div>
                              <div className="text-sm font-medium text-gray-900">
                                {product.price} TL
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="border-t p-4 flex justify-between">
                        <div>
                          <p className="text-sm text-gray-700">Toplam:</p>
                          <p className="text-sm font-semibold mt-1">{order.totalAmount} TL</p>
                        </div>
                        <div>
                          <button className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded text-sm hover:bg-indigo-100 transition-colors">
                            Sipariş Detayları
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <FaBoxOpen className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz siparişiniz bulunmuyor</h3>
                  <p className="text-gray-500 mb-6">Siparişleriniz burada görüntülenecektir</p>
                  <Link 
                    to="/collection"
                    className="inline-flex items-center justify-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Alışverişe Başla
                  </Link>
                </div>
              )}
            </div>
          )}
          
          {/* Adres Bilgileri */}
          {activeTab === 'address' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Adres Bilgilerim</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Adres
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Adresinizi girin"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Telefon Numarası
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Telefon numaranızı girin"
                    />
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700 transition-colors"
                  >
                    {saving ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        <span>Kaydediliyor...</span>
                      </>
                    ) : (
                      <>
                        <FaSave />
                        <span>Değişiklikleri Kaydet</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 