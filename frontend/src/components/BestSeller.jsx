import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaVideo, FaRegClock, FaEye } from 'react-icons/fa';
import axios from 'axios';
import { backendUrl } from '../App';

const BestSeller = () => {
    const navigate = useNavigate();
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Backend'den videoları yükleme
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true);
                
                // Trend videoları al
                const response = await axios.get(`${backendUrl}/api/video/trending`);
                
                if (response.data.success && response.data.videos.length > 0) {
                    setVideos(response.data.videos);
                } else {
                    // Eğer API'dan video gelmezse, boş array bırak
                    setVideos([]);
                }
            } catch (error) {
                console.error('Video yükleme hatası:', error);
                // Hata durumunda da boş array bırak
                setVideos([]);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-bold mb-2">Trend Videolarımız</h2>
                    <p className="text-gray-600 max-w-xl mx-auto">
                        En çok izlenen ve beğenilen video içeriklerimizi keşfedin
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, index) => (
                        <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg">
                            <div className="aspect-video bg-gray-200 animate-pulse"></div>
                            <div className="p-4">
                                <div className="h-6 bg-gray-200 animate-pulse rounded mb-3"></div>
                                <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    
    const viewVideo = () => {
        navigate('/video-feed');
    };

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="mb-10 text-center">
                <div className="inline-block bg-indigo-100 rounded-full px-3 py-1 text-indigo-700 text-sm font-semibold mb-3">
                    <FaVideo className="inline mr-2" /> VİDEO İÇERİKLER
                </div>
                <h2 className="text-3xl font-bold mb-2">Trend Videolarımız</h2>
                <p className="text-gray-600 max-w-xl mx-auto">
                    En çok izlenen ve beğenilen video içeriklerimizi keşfedin
                </p>
            </div>
            
            {videos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {videos.map((video, index) => (
                        <div
                            key={video._id}
                            className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <div className="relative aspect-video overflow-hidden group">
                                <img
                                    src={video.thumbnailUrl || `${backendUrl}/images/video-placeholder.jpg`}
                                    alt={video.title}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => {
                                        e.target.onerror = null; 
                                        e.target.src = '/placeholder-image.jpg';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <button 
                                        onClick={viewVideo}
                                        className="bg-white/90 text-indigo-700 rounded-full p-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                                    >
                                        <FaPlay className="text-2xl" />
                                    </button>
                                </div>
                                <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                                    <FaRegClock className="inline mr-1" /> {Math.floor(Math.random() * 10) + 1}:{Math.floor(Math.random() * 50) + 10}
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-1 truncate">{video.title}</h3>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{video.description}</p>
                                <div className="flex justify-between items-center text-xs text-gray-500">
                                    <span><FaEye className="inline mr-1" /> {Math.floor(Math.random() * 1000) + 100} izlenme</span>
                                    <span className="bg-gray-100 px-2 py-1 rounded-full">{video.trending ? "Trend" : "Yeni"}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-gray-50 rounded-xl p-10 text-center">
                    <FaVideo className="mx-auto text-gray-300 text-5xl mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Henüz Trend Video Bulunmuyor</h3>
                    <p className="text-gray-600 mb-6">
                        Yakında yeni video içeriklerimiz burada olacak!
                    </p>
                    <button 
                        onClick={() => navigate('/video-feed')}
                        className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Tüm Videoları Gör
                    </button>
                </div>
            )}
            
            {videos.length > 0 && (
                <div className="mt-10 text-center">
                    <button 
                        onClick={() => navigate('/video-feed')}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
                    >
                        <span>Tüm Video İçeriklerini Gör</span>
                        <FaPlay className="text-sm" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default BestSeller;