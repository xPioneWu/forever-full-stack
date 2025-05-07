import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { FaTrash, FaEdit, FaSync } from 'react-icons/fa'

const List = ({ token }) => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchList = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("Backend URL:", backendUrl)
      
      // Tam URL'i oluştur
      const apiUrl = `${backendUrl}/api/product/list`
      console.log("API URL:", apiUrl)
      
      const response = await axios.get(apiUrl)
      console.log("API response:", response.data)
      
      if (response.data.success) {
        const products = response.data.products || []
        console.log(`${products.length} ürün yüklendi`)
        setList(products.reverse())
        
        if (products.length === 0) {
          toast.info("Henüz hiç ürün eklenmemiş")
        }
      } else {
        const errorMsg = response.data.message || "Ürünler yüklenirken bir hata oluştu"
        console.error("API hata mesajı:", errorMsg)
        setError(errorMsg)
        toast.error(errorMsg)
      }
    } catch (error) {
      console.error("Ürün listeleme hatası:", error)
      const errorMsg = "Ürünler yüklenirken bir hata oluştu: " + 
        (error.response?.data?.message || error.message || "Bilinmeyen hata")
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const removeProduct = async (id) => {
    if (!window.confirm("Bu ürünü silmek istediğinizden emin misiniz?")) {
      return
    }
    
    try {
      setLoading(true)
      const response = await axios.post(`${backendUrl}/api/product/remove`, 
        { id }, 
        { headers: { token } }
      )

      if (response.data.success) {
        toast.success(response.data.message || "Ürün başarıyla silindi")
        await fetchList()
      } else {
        toast.error(response.data.message || "Ürün silinirken bir hata oluştu")
      }
    } catch (error) {
      console.error("Ürün silme hatası:", error)
      toast.error("Ürün silinirken bir hata oluştu: " + 
        (error.response?.data?.message || error.message || "Bilinmeyen hata"))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Ürün Listesi</h2>
        <div className="flex items-center gap-2">
          {error && (
            <span className="text-red-500 text-sm">{error}</span>
          )}
          <button 
            onClick={fetchList} 
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            disabled={loading}
          >
            <FaSync className={`${loading ? 'animate-spin' : ''}`} />
            <span>Yenile</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : list.length > 0 ? (
        <div className="overflow-x-auto">
          {/* ------- List Table Title ---------- */}
          <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-3 px-4 border-b bg-gray-100 text-sm font-medium'>
            <span>Resim</span>
            <span>İsim</span>
            <span>Kategori</span>
            <span>Fiyat</span>
            <span className='text-center'>İşlemler</span>
          </div>

          {/* ------ Product List ------ */}
          <div className="flex flex-col">
            {list.map((item, index) => (
              <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-3 px-4 border-b hover:bg-gray-50 text-sm' key={item._id || index}>
                <div>
                  <img 
                    className='w-12 h-12 object-cover rounded border' 
                    src={item.image && item.image.length > 0 ? item.image[0] : 'https://via.placeholder.com/50'} 
                    alt={item.name} 
                    onError={(e) => {e.target.src = 'https://via.placeholder.com/50'}}
                  />
                </div>
                <div>
                  <p className="font-medium">{item.name || 'İsimsiz Ürün'}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">{item.description || 'Açıklama yok'}</p>
                </div>
                <div className="px-2 py-1 bg-gray-100 text-xs rounded inline-block">{item.category || 'Kategorisiz'}</div>
                <div className="font-medium">{currency}{item.price || 0}</div>
                <div className='flex justify-end md:justify-center gap-3'>
                  <button className="text-blue-500 hover:text-blue-700">
                    <FaEdit size={16} />
                  </button>
                  <button 
                    onClick={() => removeProduct(item._id)} 
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">Henüz hiç ürün bulunmamaktadır.</p>
          <button 
            onClick={() => window.location.href = '/add'} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Yeni Ürün Ekle
          </button>
        </div>
      )}
    </div>
  )
}

export default List