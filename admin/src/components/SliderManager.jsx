import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { backendUrl } from '../App';

const SliderManager = ({ token }) => {
    const [sliders, setSliders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingSlider, setEditingSlider] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        link: '',
        image: null,
        order: 0,
        isActive: true
    });

    const fetchSliders = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${backendUrl}/api/slider/list`);
            if (response.data.success) {
                setSliders(response.data.sliders);
            } else {
                toast.error(response.data.message || 'Slider\'lar yüklenirken bir hata oluştu');
            }
        } catch (error) {
            console.error('Slider yükleme hatası:', error);
            toast.error('Slider\'lar yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSliders();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.image && !editingSlider) {
            toast.error('Lütfen bir resim seçin');
            return;
        }
        
        try {
            const formDataToSend = new FormData();
            
            Object.keys(formData).forEach(key => {
                if (key === 'image' && formData[key]) {
                    formDataToSend.append('image', formData[key]);
                } else if (key !== 'image') {
                    formDataToSend.append(key, formData[key]);
                }
            });

            if (editingSlider) {
                await axios.put(`${backendUrl}/api/slider/update/${editingSlider._id}`, formDataToSend, {
                    headers: { token }
                });
                toast.success('Slider başarıyla güncellendi');
            } else {
                await axios.post(`${backendUrl}/api/slider/add`, formDataToSend, {
                    headers: { token }
                });
                toast.success('Slider başarıyla eklendi');
            }

            setFormData({
                title: '',
                description: '',
                link: '',
                image: null,
                order: 0,
                isActive: true
            });
            setEditingSlider(null);
            fetchSliders();
        } catch (error) {
            console.error('Slider işlemi hatası:', error);
            toast.error(error.response?.data?.message || 'Bir hata oluştu');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu slider\'ı silmek istediğinizden emin misiniz?')) {
            try {
                const response = await axios.delete(`${backendUrl}/api/slider/delete/${id}`, {
                    headers: { token }
                });
                
                if (response.data.success) {
                    toast.success('Slider başarıyla silindi');
                    fetchSliders();
                } else {
                    toast.error(response.data.message || 'Slider silinirken bir hata oluştu');
                }
            } catch (error) {
                console.error('Slider silme hatası:', error);
                toast.error('Slider silinirken bir hata oluştu');
            }
        }
    };

    const handleEdit = (slider) => {
        setEditingSlider(slider);
        setFormData({
            title: slider.title,
            description: slider.description,
            link: slider.link || '',
            image: null,
            order: slider.order || 0,
            isActive: slider.isActive === undefined ? true : slider.isActive
        });
    };

    if (loading && sliders.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-6">{editingSlider ? 'Slider Düzenle' : 'Yeni Slider Ekle'}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Başlık
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Açıklama
                        </label>
                        <input
                            type="text"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Link (Opsiyonel)
                        </label>
                        <input
                            type="text"
                            value={formData.link}
                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sıra (Küçük değerler önce gösterilir)
                        </label>
                        <input
                            type="number"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="0"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Slider Resmi {!editingSlider && <span className="text-red-500">*</span>}
                        </label>
                        <input
                            type="file"
                            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            accept="image/*"
                            required={!editingSlider}
                        />
                        {editingSlider && (
                            <p className="text-sm text-gray-500 mt-1">
                                Sadece yeni bir resim seçerseniz değiştirilecektir
                            </p>
                        )}
                    </div>
                    <div className="flex items-center">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-700">Aktif (Göster)</span>
                        </label>
                    </div>
                </div>
                
                <div className="mt-6 flex gap-2">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        {editingSlider ? (
                            <>
                                <FaEdit size={14} />
                                <span>Güncelle</span>
                            </>
                        ) : (
                            <>
                                <FaPlus size={14} />
                                <span>Ekle</span>
                            </>
                        )}
                    </button>
                    {editingSlider && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditingSlider(null);
                                setFormData({
                                    title: '',
                                    description: '',
                                    link: '',
                                    image: null,
                                    order: 0,
                                    isActive: true
                                });
                            }}
                            className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                        >
                            İptal
                        </button>
                    )}
                </div>
            </form>

            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-6">Slider Listesi</h2>
                
                {sliders.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">Henüz slider bulunmamaktadır.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sliders.map((slider) => (
                            <div key={slider._id} className="bg-white border rounded-lg shadow-sm overflow-hidden group">
                                <div className="relative h-48">
                                    <img
                                        src={slider.image}
                                        alt={slider.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(slider)}
                                                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(slider._id)}
                                                className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-bold text-lg">{slider.title}</h3>
                                        <span className={`text-xs px-2 py-1 rounded ${slider.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {slider.isActive ? 'Aktif' : 'Pasif'}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mb-2">{slider.description}</p>
                                    {slider.link && (
                                        <a href={slider.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm block mb-2 truncate">
                                            {slider.link}
                                        </a>
                                    )}
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500">
                                            Sıra: {slider.order || 0}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            ID: {slider._id.substring(slider._id.length - 5)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SliderManager; 