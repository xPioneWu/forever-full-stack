import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { FaUser, FaSave, FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Profile = ({ token }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState({
    name: '',
    email: '',
    profilePic: ''
  });
  
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    newPassword: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();

  // Kullanıcı bilgilerini yükle
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      
      if (!token) {
        toast.error("Oturum anahtarı bulunamadı. Lütfen tekrar giriş yapın.");
        navigate('/');
        return;
      }
      
      const response = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { token }
      });
      
      if (response.data.success) {
        const userData = response.data.user;
        setUser(userData);
        setFormData(prev => ({
          ...prev,
          name: userData.name || ''
        }));
      } else {
        toast.error(response.data.message || "Profil bilgileri yüklenirken bir hata oluştu");
      }
    } catch (error) {
      console.error("Profil bilgileri yükleme hatası:", error);
      toast.error("Profil bilgileri yüklenirken bir hata oluştu: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Oturum süresi dolmuş. Lütfen tekrar giriş yapın.");
      navigate('/');
      return;
    }
    
    fetchUserProfile();
  }, [token, navigate]);

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
        name: formData.name
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Profilim</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6 pb-6 border-b">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
            {user.profilePic ? (
              <img 
                src={user.profilePic} 
                alt="Profil" 
                className="w-full h-full rounded-full object-cover" 
              />
            ) : (
              <FaUser className="text-gray-400" size={32} />
            )}
          </div>
          <div>
            <h2 className="text-xl font-medium">{user.name || 'İsimsiz Kullanıcı'}</h2>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Ad Soyad
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ad Soyad"
            />
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
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Yeni şifrenizi tekrar girin"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700 transition-colors"
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
    </div>
  );
};

export default Profile; 