import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SearchBar = () => {
    const { search, setSearch, showSearch, setShowSearch, backendUrl } = useContext(ShopContext);
    const [visible, setVisible] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(()=>{
        // Anasayfada da arama yapabilmek için visible durumunu her zaman true yapıyoruz
        setVisible(true);
    },[location])
    
    // Search input değiştiğinde öneri göster
    useEffect(() => {
        if (search.trim().length > 1) {
            fetchSuggestions(search);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [search]);
    
    // Önerileri getir
    const fetchSuggestions = async (query) => {
        try {
            const response = await axios.get(`${backendUrl}/api/product/search?query=${query}`);
            if (response.data.success) {
                setSuggestions(response.data.products);
            }
        } catch (error) {
            console.error("Arama önerileri alınamadı:", error);
            // API çalışmıyorsa veya hata varsa, basit bir arama simülasyonu
            simulateSearch(query);
        }
    };
    
    // API çalışmazsa veya hata olursa basit bir öneri simülasyonu
    const simulateSearch = (query) => {
        const dummyProducts = [
            { _id: "1", name: "Bambu Çatal Kaşık Seti" },
            { _id: "2", name: "Şef Bıçağı Set" },
            { _id: "3", name: "Kristal Cam Bardak" },
            { _id: "4", name: "Paslanmaz Çelik Tencere" },
            { _id: "5", name: "Bambu Salata Kasesi" },
            { _id: "6", name: "Ekmek Bıçağı" }
        ];
        
        const filtered = dummyProducts.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase())
        );
        
        setSuggestions(filtered.slice(0, 5));
    };
    
    const handleSearch = (e) => {
        e.preventDefault();
        setShowSuggestions(false);
        if (search.trim() && !location.pathname.includes('collection')) {
            navigate('/collection');
        }
    }
    
    // Öneriye tıklandığında
    const handleSuggestionClick = (suggestion) => {
        setSearch(suggestion.name);
        setShowSuggestions(false);
        navigate('/collection');
    };
    
    // Sayfa tıklandığında önerileri kapat
    useEffect(() => {
        const handleClickOutside = () => {
            setShowSuggestions(false);
        };
        
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);
    
    return showSearch && visible ? (
        <div className='border-t border-b bg-gray-50 text-center relative'>
            <form onSubmit={handleSearch} className='inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2'>
                <input 
                    value={search} 
                    onChange={(e)=>setSearch(e.target.value)} 
                    className='flex-1 outline-none bg-inherit text-sm' 
                    type="text" 
                    placeholder='Ürün ara...'
                    onClick={(e) => {
                        e.stopPropagation();
                        if (search.trim().length > 1) {
                            setShowSuggestions(true);
                        }
                    }}
                />
                <button type="submit">
                    <img className='w-4 cursor-pointer' src={assets.search_icon} alt="Ara" />
                </button>
            </form>
            <img onClick={()=>setShowSearch(false)} className='inline w-3 cursor-pointer' src={assets.cross_icon} alt="" />
            
            {/* Arama Önerileri */}
            {showSuggestions && suggestions.length > 0 && (
                <div 
                    onClick={(e) => e.stopPropagation()}
                    className="absolute left-1/2 transform -translate-x-1/2 w-3/4 sm:w-1/2 bg-white shadow-lg rounded-md mt-1 z-50 text-left"
                >
                    <ul>
                        {suggestions.map((suggestion) => (
                            <li 
                                key={suggestion._id} 
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                onClick={() => handleSuggestionClick(suggestion)}
                            >
                                {suggestion.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    ) : null
}

export default SearchBar
