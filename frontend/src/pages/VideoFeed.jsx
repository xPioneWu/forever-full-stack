import React, { useState, useEffect, useRef } from 'react';
import { FaShare, FaMusic, FaPause, FaPlay, FaSearch, FaCopy, FaFacebook, FaTwitter, FaWhatsapp, FaHeart, FaComment, FaBookmark } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/VideoFeed.css';

const VideoFeed = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [videos, setVideos] = useState([]);
    const [filteredVideos, setFilteredVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [showShareOptions, setShowShareOptions] = useState(false);
    const [likedVideos, setLikedVideos] = useState({});
    const [savedVideos, setSavedVideos] = useState({});
    const [showComments, setShowComments] = useState(false);
    const videoRefs = useRef({});
    const containerRef = useRef(null);
    const [startY, setStartY] = useState(null);

    // TikTok benzeri arayüz için document title ve favicon değiştir
    useEffect(() => {
        // Önceki favicon ve title değerlerini sakla
        const originalTitle = document.title;
        const originalFavicon = document.querySelector('link[rel="icon"]')?.href;
        
        // Video sayfası ayarları
        document.title = "Video Akışı";
        const videoFavicon = document.createElement('link');
        videoFavicon.rel = 'icon';
        videoFavicon.href = 'https://www.tiktok.com/favicon.ico';
        document.head.appendChild(videoFavicon);
        
        // Komponent unmount edildiğinde orijinal değerlere dön
        return () => {
            document.title = originalTitle;
            if (originalFavicon) {
                const existingFavicon = document.querySelector('link[rel="icon"]');
                if (existingFavicon) existingFavicon.href = originalFavicon;
            }
        };
    }, []);

    // Navbar'ı tamamen kaldır
    useEffect(() => {
        // Orijinal navbar referansını ve parent elementini saklayalım
        const navbar = document.querySelector('nav');
        let parentElement = null;
        let navbarIndex = -1;
        
        if (navbar) {
            parentElement = navbar.parentElement;
            // Navbar'ın parent içindeki indeksini bulalım (daha sonra aynı yere koymak için)
            const children = Array.from(parentElement.children);
            navbarIndex = children.indexOf(navbar);
            
            // Navbar'ı DOM'dan tamamen kaldır
            navbar.remove();
            
            // Body'ye padding eklenmişse kaldır
            document.body.style.paddingTop = '0';
            document.body.classList.add('video-feed-active');
        }
        
        // Sayfadan ayrılırken navbar'ı geri ekleyelim
        return () => {
            // Eğer navbar ve parent element referansları varsa
            if (navbar && parentElement) {
                // Navbar'ı kaldırıldığı aynı pozisyona geri ekleyelim
                if (navbarIndex >= 0 && navbarIndex < parentElement.children.length) {
                    parentElement.insertBefore(navbar, parentElement.children[navbarIndex]);
                } else {
                    // Eğer indeks geçerli değilse sona ekleyelim
                    parentElement.appendChild(navbar);
                }
                
                // Navbar stillerini sıfırlayalım
                navbar.style.display = '';
                navbar.style.visibility = '';
                navbar.style.opacity = '';
                navbar.style.position = '';
                navbar.style.zIndex = '';
                
                // Body stilini geri al
                document.body.style.paddingTop = '';
                document.body.classList.remove('video-feed-active');
            }
        };
    }, []);

    // Backend'den videoları çek
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true);
                const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
                const response = await axios.get(`${backendUrl}/api/video/list`);
                
                if (response.data.success) {
                    const videoData = response.data.videos.map(video => ({
                        id: video._id,
                        url: video.videoUrl,
                        username: `@${video.title.split(' ')[0].toLowerCase()}`,
                        description: video.description,
                        songName: `Orijinal Ses - ${video.title}`,
                        userImage: video.thumbnailUrl || 'https://picsum.photos/50/50',
                        category: video.category,
                        likes: Math.floor(Math.random() * 1000),
                        comments: Math.floor(Math.random() * 100)
                    }));
                    
                    setVideos(videoData);
                    setFilteredVideos(videoData);
                } else {
                    // Eğer API çağrısı başarısız olursa default videoları göster
                    const defaultVideos = [
                        {
                            id: 1,
                            url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                            username: '@naturelover',
                            description: 'Muhteşem doğa manzaraları 🌲 #doğa #huzur',
                            songName: 'Orijinal Ses - Doğa Sesleri',
                            userImage: 'https://picsum.photos/50/50',
                            category: 'Trending',
                            likes: 1245,
                            comments: 87
                        },
                        {
                            id: 2,
                            url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                            username: '@citylights',
                            description: 'Şehrin en güzel anları 🌆 #şehir #gece',
                            songName: 'Popüler Müzik - Şehir Sesleri',
                            userImage: 'https://picsum.photos/51/51',
                            category: 'Popular',
                            likes: 845,
                            comments: 32
                        },
                        {
                            id: 3,
                            url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                            username: '@beachlover',
                            description: 'Deniz kenarında huzurlu anlar 🌊 #deniz #yaz',
                            songName: 'Trend Müzik - Dalga Sesleri',
                            userImage: 'https://picsum.photos/52/52',
                            category: 'Latest',
                            likes: 2156,
                            comments: 123
                        }
                    ];
                    
                    setVideos(defaultVideos);
                    setFilteredVideos(defaultVideos);
                }
                
                setLoading(false);
            } catch (error) {
                console.error('Videoları yüklerken hata oluştu:', error);
                setLoading(false);
                toast.error("Videolar yüklenirken bir hata oluştu");
            }
        };
        
        fetchVideos();
    }, []);

    // Videoları izle
    useEffect(() => {
        const currentVideo = videoRefs.current[currentIndex];
        
        if (currentVideo) {
            if (isPlaying) {
                currentVideo.play().catch(error => {
                    console.error('Video oynatılırken hata:', error);
                });
            } else {
                currentVideo.pause();
            }
        }
        
        // Diğer tüm videoları durdur
        Object.keys(videoRefs.current).forEach(index => {
            if (parseInt(index) !== currentIndex && videoRefs.current[index]) {
                videoRefs.current[index].pause();
                videoRefs.current[index].currentTime = 0;
            }
        });
    }, [currentIndex, isPlaying]);

    // Arama fonksiyonu
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        filterVideos(e.target.value, activeCategory);
    };

    // Kategori filtresi
    const handleCategoryFilter = (category) => {
        setActiveCategory(category);
        filterVideos(searchQuery, category);
    };

    // Filtre uygulama
    const filterVideos = (query, category) => {
        let filtered = videos;
        
        // Arama sorgusu filtreleme
        if (query) {
            filtered = filtered.filter(video => 
                video.description.toLowerCase().includes(query.toLowerCase()) ||
                video.username.toLowerCase().includes(query.toLowerCase())
            );
        }
        
        // Kategori filtreleme
        if (category !== 'all') {
            filtered = filtered.filter(video => video.category.toLowerCase() === category.toLowerCase());
        }
        
        setFilteredVideos(filtered);
        
        // Filtreleme sonrası ilk videoya dön
        if (filtered.length > 0) {
            setCurrentIndex(0);
            setIsPlaying(true);
        }
    };

    // Video oynatma kontrolü
    const togglePlay = () => {
        const video = videoRefs.current[currentIndex];
        
        if (video) {
            if (isPlaying) {
                video.pause();
            } else {
                video.play().catch(error => {
                    console.error('Video oynatılırken hata:', error);
                });
            }
            
            setIsPlaying(!isPlaying);
        }
    };

    // Paylaşım menüsü
    const handleShare = () => {
        setShowShareOptions(!showShareOptions);
    };

    // Video linkini kopyala
    const copyVideoLink = () => {
        if (filteredVideos[currentIndex]?.url) {
            navigator.clipboard.writeText(filteredVideos[currentIndex].url)
                .then(() => {
                    toast.success("Video linki panoya kopyalandı!");
                    setShowShareOptions(false);
                })
                .catch(() => {
                    toast.error("Link kopyalanırken bir hata oluştu");
                });
        }
    };

    // Beğeni işlemi
    const toggleLike = (videoId) => {
        setLikedVideos(prev => ({
            ...prev,
            [videoId]: !prev[videoId]
        }));
        
        // Gerçek uygulamada API çağrısı yapılacak
        toast.success(likedVideos[videoId] ? "Beğeni kaldırıldı" : "Video beğenildi");
    };

    // Kaydetme işlemi
    const toggleSave = (videoId) => {
        setSavedVideos(prev => ({
            ...prev,
            [videoId]: !prev[videoId]
        }));
        
        // Gerçek uygulamada API çağrısı yapılacak
        toast.success(savedVideos[videoId] ? "Video kaydedilenlerden çıkarıldı" : "Video kaydedildi");
    };

    // Yorum bölümünü aç/kapat
    const toggleComments = () => {
        setShowComments(!showComments);
    };

    // Kaydırmayı yönet
    const handleWheel = (e) => {
        if (e.deltaY > 0 && currentIndex < filteredVideos.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else if (e.deltaY < 0 && currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    // Klavye olaylarını dinle
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowDown' && currentIndex < filteredVideos.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else if (e.key === 'ArrowUp' && currentIndex > 0) {
                setCurrentIndex(prev => prev - 1);
            } else if (e.key === ' ') {
                togglePlay();
                e.preventDefault();
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex, filteredVideos.length]);

    // Dokunma desteği
    const handleTouchStart = (e) => {
        setStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e) => {
        if (!startY) return;
        
        const currentY = e.touches[0].clientY;
        const diff = startY - currentY;
        
        // Aşağı kaydırma
        if (diff > 50 && currentIndex < filteredVideos.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setStartY(null);
        }
        // Yukarı kaydırma
        else if (diff < -50 && currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setStartY(null);
        }
    };

    const handleTouchEnd = () => {
        setStartY(null);
    };

    return (
        <div className="video-feed-container bg-black min-h-screen overflow-hidden" ref={containerRef}>
            {/* Üst menü */}
            <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 py-3 bg-black/80 backdrop-blur-md border-b border-gray-800">
                <div className="flex items-center gap-4">
                    <button onClick={() => window.history.back()} className="text-white">
                        <IoMdClose size={28} />
                    </button>
                    <h1 className="text-xl font-bold text-white">Video Keşfi</h1>
                </div>
                
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Video ara..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="bg-gray-800 text-white rounded-full px-4 pr-10 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            {/* Kategori filtreleri */}
            <div className="fixed top-16 left-0 right-0 z-50 flex items-center px-4 py-2 overflow-x-auto bg-black/60 backdrop-blur-md border-b border-gray-800 hide-scrollbar">
                {['all', 'trending', 'popular', 'latest', 'mutfak', 'ev', 'bahçe'].map(category => (
                    <button
                        key={category}
                        onClick={() => handleCategoryFilter(category)}
                        className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
                            activeCategory === category 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                    >
                        {category === 'all' ? 'Tümü' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                ))}
            </div>

            {/* İçerik Alanı - Paddingleri düzenleyerek menü altında içerik görünmesini engelliyoruz */}
            <div className="pt-32">
                {/* Videolar */}
                {loading ? (
                    <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : filteredVideos.length === 0 ? (
                    <div className="flex flex-col justify-center items-center h-[calc(100vh-8rem)] text-white">
                        <FaSearch size={50} className="mb-4 text-gray-500" />
                        <h2 className="text-2xl font-bold mb-2">Video Bulunamadı</h2>
                        <p className="text-gray-400 mb-6">Aramanızla eşleşen video bulunamadı.</p>
                        <button 
                            onClick={() => {setSearchQuery(''); setActiveCategory('all'); filterVideos('', 'all');}}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                        >
                            Tüm Videoları Göster
                        </button>
                    </div>
                ) : (
                    <div 
                        className="video-slider relative" 
                        onWheel={handleWheel}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        {filteredVideos.map((video, index) => (
                            <div 
                                key={video.id}
                                className={`video-container ${currentIndex === index ? 'active' : ''}`}
                                style={{ transform: `translateY(${(index - currentIndex) * 100}vh)` }}
                            >
                                <video
                                    ref={el => { videoRefs.current[index] = el; }}
                                    src={video.url}
                                    loop
                                    playsInline
                                    className="video-element"
                                    onClick={togglePlay}
                                />
                                
                                {/* Video içeriği overlay */}
                                <div className="video-overlay">
                                    {/* Oynatma/duraklatma düğmesi */}
                                    {currentIndex === index && !isPlaying && (
                                        <div className="play-icon" onClick={togglePlay}>
                                            <FaPlay size={50} />
                                        </div>
                                    )}
                                    
                                    {/* Video bilgileri */}
                                    <div className="video-info">
                                        <div className="user-info">
                                            <img src={video.userImage} alt={video.username} className="user-avatar" />
                                            <div>
                                                <h3>{video.username}</h3>
                                                <p className="description">{video.description}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="music-info">
                                            <FaMusic className="music-icon" />
                                            <p>{video.songName}</p>
                                        </div>
                                    </div>
                                    
                                    {/* Etkileşim düğmeleri */}
                                    <div className="action-buttons">
                                        <div className="action-button" onClick={() => toggleLike(video.id)}>
                                            <FaHeart 
                                                size={28} 
                                                className={likedVideos[video.id] ? 'text-red-500' : 'text-white'} 
                                            />
                                            <span>{likedVideos[video.id] ? video.likes + 1 : video.likes}</span>
                                        </div>
                                        
                                        <div className="action-button" onClick={toggleComments}>
                                            <FaComment size={28} />
                                            <span>{video.comments}</span>
                                        </div>
                                        
                                        <div className="action-button" onClick={handleShare}>
                                            <FaShare size={28} />
                                            <span>Paylaş</span>
                                        </div>
                                        
                                        <div className="action-button" onClick={() => toggleSave(video.id)}>
                                            <FaBookmark 
                                                size={28} 
                                                className={savedVideos[video.id] ? 'text-blue-500' : 'text-white'} 
                                            />
                                            <span>Kaydet</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Paylaşım menüsü */}
            {showShareOptions && (
                <div className="share-menu">
                    <div className="share-header">
                        <h3>Video Paylaş</h3>
                        <button onClick={() => setShowShareOptions(false)}>
                            <IoMdClose size={24} />
                        </button>
                    </div>
                    <div className="share-options">
                        <button className="share-option" onClick={copyVideoLink}>
                            <FaCopy size={24} />
                            <span>Linki Kopyala</span>
                        </button>
                        <button className="share-option">
                            <FaFacebook size={24} />
                            <span>Facebook</span>
                        </button>
                        <button className="share-option">
                            <FaTwitter size={24} />
                            <span>Twitter</span>
                        </button>
                        <button className="share-option">
                            <FaWhatsapp size={24} />
                            <span>WhatsApp</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Yorumlar bölümü */}
            {showComments && (
                <div className="comments-section">
                    <div className="comments-header">
                        <h3>Yorumlar ({filteredVideos[currentIndex]?.comments})</h3>
                        <button onClick={toggleComments}>
                            <IoMdClose size={24} />
                        </button>
                    </div>
                    <div className="comments-list">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className="comment">
                                <img src={`https://picsum.photos/50/50?random=${index}`} alt="User" className="comment-avatar" />
                                <div className="comment-content">
                                    <h4 className="comment-username">Kullanıcı{index + 1}</h4>
                                    <p className="comment-text">Harika bir video! Gerçekten çok etkileyici. 👍</p>
                                    <div className="comment-meta">
                                        <span>2 saat önce</span>
                                        <button className="comment-like">
                                            <FaHeart size={12} />
                                            <span>{Math.floor(Math.random() * 50)}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="comment-input">
                        <input type="text" placeholder="Yorum yaz..." />
                        <button>Gönder</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoFeed;