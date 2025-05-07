import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const AddVideoPage = () => {
    const { token, backendUrl } = useContext(ShopContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    
    // Form state
    const [video, setVideo] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Trending');
    const [isTrending, setIsTrending] = useState(false);
    
    // Kullanıcı bilgilerini getir
    useEffect(() => {
        const fetchUserData = async () => {
            if (!token) {
                toast.error('Bu sayfayı görmek için giriş yapmalısınız');
                navigate('/login');
                return;
            }
            
            try {
                const response = await axios.post(
                    `${backendUrl}/api/user/profile`,
                    {},
                    { headers: { token } }
                );
                
                if (response.data.success) {
                    setUserData(response.data.user);
                } else {
                    toast.error('Kullanıcı bilgileri alınamadı');
                    navigate('/login');
                }
            } catch (error) {
                console.error('Kullanıcı bilgileri hatası:', error);
                toast.error('Lütfen tekrar giriş yapın');
                navigate('/login');
            }
        };
        
        fetchUserData();
    }, [token, navigate, backendUrl]);
    
    // Form gönderme işlemi
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!video) {
            return toast.error('Lütfen bir video yükleyin');
        }
        
        if (!title.trim() || !description.trim()) {
            return toast.error('Lütfen tüm alanları doldurun');
        }
        
        setLoading(true);
        
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('category', category);
            formData.append('trending', isTrending);
            formData.append('video', video);
            
            if (thumbnail) {
                formData.append('thumbnail', thumbnail);
            }
            
            if (userData && userData._id) {
                formData.append('userId', userData._id);
            }
            
            const response = await axios.post(
                `${backendUrl}/api/video/add`,
                formData,
                {
                    headers: {
                        token,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            
            if (response.data.success) {
                toast.success('Video başarıyla yüklendi');
                navigate('/profile'); // Profil sayfasına yönlendir
            } else {
                toast.error(response.data.message || 'Video yüklenirken bir hata oluştu');
            }
        } catch (error) {
            console.error('Video yükleme hatası:', error);
            toast.error('Video yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };
    
    // Dosya seçici işlevleri
    const handleVideoChange = (e) => {
        if (e.target.files.length > 0) {
            setVideo(e.target.files[0]);
        }
    };
    
    const handleThumbnailChange = (e) => {
        if (e.target.files.length > 0) {
            setThumbnail(e.target.files[0]);
        }
    };
    
    if (!token) {
        return null; // Kullanıcı giriş yapmamışsa hiçbir şey gösterme
    }
    
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold mb-6">Yeni Video Yükle</h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 mb-2">Video Dosyası*</label>
                        <input
                            type="file"
                            accept="video/*"
                            onChange={handleVideoChange}
                            className="w-full border border-gray-300 rounded p-2"
                            required
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Yükleyeceğiniz video en fazla 100MB olabilir
                        </p>
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 mb-2">Kapak Görseli (İsteğe Bağlı)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailChange}
                            className="w-full border border-gray-300 rounded p-2"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Video için bir kapak görseli eklemek isterseniz
                        </p>
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 mb-2">Video Başlığı*</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-gray-300 rounded p-2"
                            placeholder="Video başlığını girin"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 mb-2">Video Açıklaması*</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border border-gray-300 rounded p-2 min-h-[100px]"
                            placeholder="Video açıklamasını girin"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 mb-2">Kategori</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full border border-gray-300 rounded p-2"
                        >
                            <option value="Trending">Trending</option>
                            <option value="Latest">Latest</option>
                            <option value="Popular">Popular</option>
                        </select>
                    </div>
                    
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="trending-checkbox"
                            checked={isTrending}
                            onChange={() => setIsTrending(!isTrending)}
                            className="mr-2"
                        />
                        <label htmlFor="trending-checkbox" className="text-gray-700">
                            Bu videoyu trending olarak işaretle
                        </label>
                    </div>
                    
                    <div className="flex justify-between pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/profile')}
                            className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300 transition"
                        >
                            İptal
                        </button>
                        
                        <button
                            type="submit"
                            disabled={loading}
                            className={`bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition ${
                                loading ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                        >
                            {loading ? 'Yükleniyor...' : 'Video Yükle'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddVideoPage; 