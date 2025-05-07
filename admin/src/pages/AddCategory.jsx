import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { FaTrash, FaEdit, FaSync } from 'react-icons/fa'

const AddCategory = ({ token }) => {
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(backendUrl + "/api/category/list");
      
      if (response.data.success) {
        setCategories(response.data.categories);
      } else {
        toast.error(response.data.message || "Kategoriler yüklenirken bir hata oluştu");
      }
    } catch (error) {
      console.error("Kategori listeleme hatası:", error);
      toast.error("Kategoriler yüklenirken bir hata oluştu");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const categoryData = {
        name: categoryName,
        description
      };

      let response;

      if (editMode) {
        response = await axios.post(
          backendUrl + "/api/category/update",
          { id: editId, ...categoryData },
          { headers: { token } }
        );
      } else {
        response = await axios.post(
          backendUrl + "/api/category/add",
          categoryData,
          { headers: { token } }
        );
      }

      if (response.data.success) {
        toast.success(response.data.message);
        setCategoryName("");
        setDescription("");
        setEditMode(false);
        setEditId(null);
        fetchCategories();
      } else {
        toast.error(response.data.message || "İşlem sırasında bir hata oluştu");
      }
    } catch (error) {
      console.error("Kategori işlem hatası:", error);
      toast.error("İşlem sırasında bir hata oluştu");
    }
  };

  const handleEdit = (category) => {
    setCategoryName(category.name);
    setDescription(category.description);
    setEditMode(true);
    setEditId(category._id);
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm("Bu kategoriyi silmek istediğinizden emin misiniz?")) {
      try {
        const response = await axios.post(
          backendUrl + "/api/category/remove",
          { categoryId },
          { headers: { token } }
        );

        if (response.data.success) {
          toast.success(response.data.message);
          fetchCategories();
        } else {
          toast.error(response.data.message || "Silme işlemi sırasında bir hata oluştu");
        }
      } catch (error) {
        console.error("Kategori silme hatası:", error);
        toast.error("Silme işlemi sırasında bir hata oluştu");
      }
    }
  };

  return (
    <div className='flex flex-col gap-8'>
      {/* Kategori Ekleme/Düzenleme Formu */}
      <div className='bg-white p-6 rounded-lg shadow-sm'>
        <h2 className='text-xl font-semibold mb-4'>
          {editMode ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
        </h2>
        <form onSubmit={onSubmitHandler} className='flex flex-col gap-4'>
          <div className='w-full'>
            <p className='mb-2'>Kategori Adı</p>
            <input
              onChange={(e) => setCategoryName(e.target.value)}
              value={categoryName}
              className='w-full max-w-[500px] px-3 py-2 border rounded'
              type="text"
              placeholder='Kategori adını girin'
              required
            />
          </div>

          <div className='w-full'>
            <p className='mb-2'>Açıklama</p>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              className='w-full max-w-[500px] px-3 py-2 border rounded min-h-[100px]'
              placeholder='Kategori açıklamasını girin'
              required
            />
          </div>

          <div className='flex gap-4'>
            <button
              type="submit"
              className='w-28 py-3 bg-black text-white rounded hover:bg-gray-800 transition-colors'
            >
              {editMode ? 'GÜNCELLE' : 'EKLE'}
            </button>
            {editMode && (
              <button
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setEditId(null);
                  setCategoryName("");
                  setDescription("");
                }}
                className='w-28 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors'
              >
                İPTAL
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Kategori Listesi */}
      <div className='bg-white p-6 rounded-lg shadow-sm'>
        <div className="flex justify-between items-center mb-4">
          <h2 className='text-xl font-semibold'>Kategori Listesi</h2>
          <button 
            onClick={fetchCategories} 
            className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
            disabled={loading}
          >
            <FaSync className={`${loading ? 'animate-spin' : ''}`} size={14} />
            <span className="text-sm">Yenile</span>
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : categories.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {categories.map((category) => (
              <div key={category._id} className='border rounded-lg p-4 hover:shadow-md transition-shadow'>
                <h3 className='font-semibold mb-2'>{category.name}</h3>
                <p className='text-sm text-gray-600 mb-4'>{category.description}</p>
                <div className='flex justify-end gap-2'>
                  <button
                    onClick={() => handleEdit(category)}
                    className='text-blue-500 hover:text-blue-700'
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className='text-red-500 hover:text-red-700'
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center py-6 bg-gray-50 rounded-xl'>
            <p className='text-gray-600'>Henüz hiç kategori bulunmamaktadır.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddCategory; 