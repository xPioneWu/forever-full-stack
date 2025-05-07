import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { FaTrash, FaStar, FaRegStar, FaEdit, FaPlus } from 'react-icons/fa'

const AddVideo = ({ token }) => {
    const [video, setVideo] = useState(false)
    const [thumbnail, setThumbnail] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("Trending")
    const [isTrending, setIsTrending] = useState(false)
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(false)
    const [editingVideo, setEditingVideo] = useState(null)
    const [adminData, setAdminData] = useState(null)

    // Admin bilgilerini getir
    const fetchAdminData = async () => {
        try {
            const response = await axios.post(
                backendUrl + "/api/admin/info",
                {},
                { headers: { token } }
            )
            if (response.data.success) {
                setAdminData(response.data.admin)
            }
        } catch (error) {
            console.error("Admin bilgileri alınamadı:", error)
        }
    }

    // Videoları getir
    const fetchVideos = async () => {
        try {
            setLoading(true)
            const response = await axios.get(backendUrl + "/api/video/list")
            if (response.data.success) {
                setVideos(response.data.videos)
            } else {
                toast.error(response.data.message || "Videolar yüklenirken bir hata oluştu")
            }
        } catch (error) {
            console.error("Video yükleme hatası:", error)
            toast.error(error.response?.data?.message || "Videolar yüklenirken bir hata oluştu")
        } finally {
            setLoading(false)
        }
    }

    // Komponent yüklendiğinde videoları ve admin bilgilerini getir
    useEffect(() => {
        fetchVideos()
        fetchAdminData()
    }, [])

    // Düzenleme modunu ayarla
    const handleEditMode = (video) => {
        setEditingVideo(video)
        setTitle(video.title)
        setDescription(video.description)
        setCategory(video.category)
        setIsTrending(video.trending)
        
        // Sayfanın üstüne kaydır
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // Düzenleme modunu iptal et
    const cancelEdit = () => {
        setEditingVideo(null)
        setTitle("")
        setDescription("")
        setCategory("Trending")
        setIsTrending(false)
        setVideo(false)
        setThumbnail(false)
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()

        // Düzenleme modunda mı kontrolü
        if (editingVideo) {
            try {
                const response = await axios.post(
                    backendUrl + "/api/video/update",
                    {
                        videoId: editingVideo._id,
                        title,
                        description,
                        category,
                        trending: isTrending
                    },
                    { headers: { token } }
                )

                if (response.data.success) {
                    toast.success("Video başarıyla güncellendi")
                    cancelEdit()
                    fetchVideos()
                } else {
                    toast.error(response.data.message || "Video güncellenirken bir hata oluştu")
                }
            } catch (error) {
                console.error('Video güncelleme hatası:', error)
                toast.error(error.response?.data?.message || 'Video güncellenirken bir hata oluştu')
            }
            return
        }

        // Yeni video ekleme
        try {
            const formData = new FormData()

            formData.append("title", title)
            formData.append("description", description)
            formData.append("category", category)
            formData.append("trending", isTrending)

            // Admin ID'sini ekle
            if (adminData && adminData._id) {
                formData.append("userId", adminData._id)
            }

            if (video) {
                formData.append("video", video)
            } else {
                return toast.error("Video yüklemeniz gerekiyor")
            }

            thumbnail && formData.append("thumbnail", thumbnail)

            const response = await axios.post(backendUrl + "/api/video/add", formData, {
                headers: {
                    token,
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (response.data.success) {
                toast.success(response.data.message)
                // Form alanlarını temizle
                setTitle('')
                setDescription('')
                setVideo(false)
                setThumbnail(false)
                setCategory("Trending")
                setIsTrending(false)
                // Videoları yeniden yükle
                fetchVideos()
            } else {
                toast.error(response.data.message || "Video eklenirken bir hata oluştu")
            }

        } catch (error) {
            console.error('Video ekleme hatası:', error)
            toast.error(error.response?.data?.message || 'Video eklenirken bir hata oluştu')
        }
    }

    // Video silme fonksiyonu
    const handleDeleteVideo = async (videoId) => {
        if (window.confirm("Bu videoyu silmek istediğinizden emin misiniz?")) {
            try {
                const response = await axios.post(
                    backendUrl + "/api/video/remove", 
                    { videoId }, 
                    { headers: { token } }
                )
                
                if (response.data.success) {
                    toast.success("Video başarıyla silindi")
                    // Videoları yeniden yükle
                    fetchVideos()
                } else {
                    toast.error(response.data.message || "Video silinirken bir hata oluştu")
                }
            } catch (error) {
                console.error("Video silme hatası:", error)
                toast.error(error.response?.data?.message || "Video silinirken bir hata oluştu")
            }
        }
    }

    // Trending durumunu değiştir
    const handleToggleTrending = async (videoId, currentTrending) => {
        try {
            const response = await axios.post(
                backendUrl + "/api/video/toggle-trending",
                { videoId, trending: !currentTrending },
                { headers: { token } }
            )

            if (response.data.success) {
                toast.success(response.data.message)
                // Videoları yeniden yükle
                fetchVideos()
            } else {
                toast.error(response.data.message || "İşlem sırasında bir hata oluştu")
            }
        } catch (error) {
            console.error("Trending değiştirme hatası:", error)
            toast.error(error.response?.data?.message || "İşlem sırasında bir hata oluştu")
        }
    }

    return (
        <div className='flex flex-col gap-8'>
            {/* Video Ekleme/Düzenleme Formu */}
            <div className='bg-white p-6 rounded-lg shadow-sm'>
                <h2 className='text-xl font-semibold mb-4'>
                    {editingVideo ? 'Video Düzenle' : 'Yeni Video Ekle'}
                </h2>
                <form onSubmit={onSubmitHandler} className='flex flex-col gap-4'>
                    {!editingVideo && (
                        <div className='w-full'>
                            <p className='mb-2'>Video Dosyası</p>
                            <input
                                onChange={(e) => setVideo(e.target.files[0])}
                                className='w-full max-w-[500px]'
                                type="file"
                                accept="video/*"
                                required
                            />
                        </div>
                    )}

                    {!editingVideo && (
                        <div className='w-full'>
                            <p className='mb-2'>Thumbnail (Opsiyonel)</p>
                            <input
                                onChange={(e) => setThumbnail(e.target.files[0])}
                                className='w-full max-w-[500px]'
                                type="file"
                                accept="image/*"
                            />
                        </div>
                    )}

                    <div className='w-full'>
                        <p className='mb-2'>Video Başlığı</p>
                        <input
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                            className='w-full max-w-[500px] px-3 py-2 border rounded'
                            type="text"
                            placeholder='Video başlığını girin'
                            required
                        />
                    </div>

                    <div className='w-full'>
                        <p className='mb-2'>Video Açıklaması</p>
                        <textarea
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                            className='w-full max-w-[500px] px-3 py-2 border rounded min-h-[100px]'
                            placeholder='Video açıklamasını girin'
                            required
                        />
                    </div>

                    <div>
                        <p className='mb-2'>Kategori</p>
                        <select
                            onChange={(e) => setCategory(e.target.value)}
                            value={category}
                            className='px-3 py-2 border rounded'
                        >
                            <option value="Trending">Trending</option>
                            <option value="Latest">Latest</option>
                            <option value="Popular">Popular</option>
                        </select>
                    </div>

                    <div className='flex items-center gap-2 mt-2'>
                        <input
                            id="trending-checkbox"
                            type="checkbox"
                            checked={isTrending}
                            onChange={() => setIsTrending(!isTrending)}
                            className='w-4 h-4'
                        />
                        <label htmlFor="trending-checkbox" className='cursor-pointer text-sm'>
                            Bu videoyu anasayfada trend olarak göster
                        </label>
                    </div>

                    <div className='flex gap-3 mt-4'>
                        <button
                            type="submit"
                            className='py-3 px-6 bg-black text-white rounded hover:bg-gray-800 transition-colors'
                        >
                            {editingVideo ? 'GÜNCELLE' : 'EKLE'}
                        </button>

                        {editingVideo && (
                            <button
                                type="button"
                                onClick={cancelEdit}
                                className='py-3 px-6 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors'
                            >
                                İPTAL
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Video Listesi */}
            <div className='bg-white p-6 rounded-lg shadow-sm'>
                <h2 className='text-xl font-semibold mb-4'>Video Listesi</h2>
                <p className='text-sm text-gray-500 mb-4'>
                    Trend olarak işaretlenen videolar anasayfada gösterilir. 
                    İstediğiniz kadar videoyu trend olarak işaretleyebilirsiniz.
                </p>
                
                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
                    </div>
                ) : videos.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {videos.map((video) => (
                            <div key={video._id} className='border rounded-lg p-4'>
                                <div className='aspect-video mb-4'>
                                    <img 
                                        src={video.thumbnailUrl || 'https://via.placeholder.com/300x200'} 
                                        alt={video.title}
                                        className='w-full h-full object-cover rounded'
                                    />
                                </div>
                                <h3 className='font-semibold mb-2'>{video.title}</h3>
                                <p className='text-sm text-gray-600 mb-2 line-clamp-2'>{video.description}</p>
                                <div className='flex justify-between items-center'>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-sm text-gray-500'>{video.category}</span>
                                        {video.trending && (
                                            <span className='bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full'>
                                                Trend
                                            </span>
                                        )}
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <button 
                                            onClick={() => handleEditMode(video)}
                                            className='text-blue-500 hover:text-blue-700'
                                            title='Videoyu düzenle'
                                        >
                                            <FaEdit />
                                        </button>
                                        <button 
                                            onClick={() => handleToggleTrending(video._id, video.trending)}
                                            className={`${video.trending ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-700`}
                                            title={video.trending ? 'Trendi kaldır' : 'Trend yap'}
                                        >
                                            {video.trending ? <FaStar /> : <FaRegStar />}
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteVideo(video._id)}
                                            className='text-red-500 hover:text-red-700'
                                            title='Videoyu sil'
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        Henüz video bulunmamaktadır.
                    </div>
                )}
            </div>
        </div>
    )
}

export default AddVideo