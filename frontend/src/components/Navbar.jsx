import React, { useContext, useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { FaSearch, FaUser, FaShoppingCart, FaBars, FaTimes, FaSignOutAlt, FaBoxOpen, FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
    const [visible, setVisible] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext);

    // Sayfa kaydırma olayını izle
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const logout = () => {
        navigate('/login')
        localStorage.removeItem('token')
        setToken('')
        setCartItems({})
    }

    return (
        <div className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white/90 backdrop-blur-md'}`}>
            <div className='max-w-7xl mx-auto flex items-center justify-between py-3 px-4 md:py-4 md:px-6'>
                <Link to='/' className='transition-transform hover:scale-105'>
                    <img src={assets.logo} className='w-28 md:w-36' alt="Logo" />
                </Link>

                {/* Masaüstü Navigasyon */}
                <ul className='hidden md:flex gap-8 text-sm font-medium'>
                    <NavLink 
                        to='/' 
                        className={({isActive}) => 
                            isActive 
                                ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1'
                                : 'hover:text-indigo-600 transition-colors'
                        }
                    >
                        Anasayfa
                    </NavLink>
                    <NavLink 
                        to='/collection' 
                        className={({isActive}) => 
                            isActive 
                                ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1'
                                : 'hover:text-indigo-600 transition-colors'
                        }
                    >
                        Ürünlerimiz
                    </NavLink>
                    <NavLink 
                        to='/about' 
                        className={({isActive}) => 
                            isActive 
                                ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1'
                                : 'hover:text-indigo-600 transition-colors'
                        }
                    >
                        Hakkımızda
                    </NavLink>
                    <NavLink 
                        to='/contact' 
                        className={({isActive}) => 
                            isActive 
                                ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1'
                                : 'hover:text-indigo-600 transition-colors'
                        }
                    >
                        İletişim
                    </NavLink>
                    <NavLink 
                        to='/video-feed' 
                        className={({isActive}) => 
                            isActive 
                                ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1'
                                : 'hover:text-indigo-600 transition-colors'
                        }
                    >
                        Video
                    </NavLink>
                </ul>

                <div className='flex items-center gap-6'>
                    <button 
                        onClick={() => setShowSearch(true)}
                        className='text-gray-700 hover:text-indigo-600 transition-colors'
                        aria-label="Ara"
                    >
                        <FaSearch size={18} />
                    </button>
                    
                    <div className='group relative'>
                        <button 
                            onClick={() => token ? null : navigate('/login')}
                            className='text-gray-700 hover:text-indigo-600 transition-colors'
                            aria-label="Hesabım"
                        >
                            <FaUser size={18} />
                        </button>
                        
                        {/* Açılır Menü */}
                        {token && (
                            <div className='invisible group-hover:visible absolute right-0 pt-4 w-48 opacity-0 group-hover:opacity-100 transition-all duration-200'>
                                <div className='bg-white rounded-lg shadow-xl py-2 text-gray-700'>
                                    <div className='border-b pb-2 mb-2 px-4'>
                                        <p className='text-sm text-gray-400'>Hesabım</p>
                                    </div>
                                    <div className='flex flex-col text-sm'>
                                        <button 
                                            className='flex items-center gap-2 px-4 py-2 hover:bg-gray-50'
                                            onClick={() => navigate('/profile')}
                                        >
                                            <FaUserCircle className='text-indigo-500' />
                                            Profilim
                                        </button>
                                        <button 
                                            className='flex items-center gap-2 px-4 py-2 hover:bg-gray-50'
                                            onClick={() => navigate('/orders')}
                                        >
                                            <FaBoxOpen className='text-indigo-500' />
                                            Siparişlerim
                                        </button>
                                        <button 
                                            className='flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-red-500'
                                            onClick={logout}
                                        >
                                            <FaSignOutAlt />
                                            Çıkış Yap
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <Link to='/cart' className='relative text-gray-700 hover:text-indigo-600 transition-colors'>
                        <FaShoppingCart size={18} />
                        {getCartCount() > 0 && (
                            <span className='absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium'>
                                {getCartCount()}
                            </span>
                        )}
                    </Link>
                    
                    {/* Mobil Menü Düğmesi */}
                    <button 
                        onClick={() => setVisible(true)} 
                        className='text-gray-700 md:hidden'
                        aria-label="Menü Aç"
                    >
                        <FaBars size={20} />
                    </button>
                </div>
            </div>

            {/* Mobil Navigasyon */}
            {visible && (
                <div className='fixed inset-0 z-50 bg-black/50 md:hidden'>
                    <div className='fixed top-0 right-0 h-full w-[280px] bg-white shadow-xl p-5 transform transition-transform duration-300 ease-in-out'>
                        <div className='flex justify-between items-center mb-6'>
                            <h2 className='text-lg font-semibold'>Menü</h2>
                            <button 
                                onClick={() => setVisible(false)}
                                className='text-gray-700 hover:text-gray-900'
                                aria-label="Menü Kapat"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>
                        
                        <div className='flex flex-col gap-4'>
                            <NavLink 
                                to='/' 
                                onClick={() => setVisible(false)}
                                className={({isActive}) => 
                                    `py-2 border-b border-gray-100 ${isActive ? 'text-indigo-600 font-medium' : 'text-gray-700'}`
                                }
                            >
                                Anasayfa
                            </NavLink>
                            <NavLink 
                                to='/collection' 
                                onClick={() => setVisible(false)}
                                className={({isActive}) => 
                                    `py-2 border-b border-gray-100 ${isActive ? 'text-indigo-600 font-medium' : 'text-gray-700'}`
                                }
                            >
                                Ürünlerimiz
                            </NavLink>
                            <NavLink 
                                to='/about' 
                                onClick={() => setVisible(false)}
                                className={({isActive}) => 
                                    `py-2 border-b border-gray-100 ${isActive ? 'text-indigo-600 font-medium' : 'text-gray-700'}`
                                }
                            >
                                Hakkımızda
                            </NavLink>
                            <NavLink 
                                to='/contact' 
                                onClick={() => setVisible(false)}
                                className={({isActive}) => 
                                    `py-2 border-b border-gray-100 ${isActive ? 'text-indigo-600 font-medium' : 'text-gray-700'}`
                                }
                            >
                                İletişim
                            </NavLink>
                            <NavLink 
                                to='/video-feed' 
                                onClick={() => setVisible(false)}
                                className={({isActive}) => 
                                    `py-2 border-b border-gray-100 ${isActive ? 'text-indigo-600 font-medium' : 'text-gray-700'}`
                                }
                            >
                                Video
                            </NavLink>
                        </div>
                        
                        {token ? (
                            <div className='mt-6 pt-6 border-t border-gray-100'>
                                <div className='flex flex-col gap-4'>
                                    <button 
                                        className='flex items-center gap-2 py-2 text-gray-700'
                                        onClick={() => {
                                            navigate('/profile');
                                            setVisible(false);
                                        }}
                                    >
                                        <FaUserCircle size={18} />
                                        Profilim
                                    </button>
                                    <button 
                                        className='flex items-center gap-2 py-2 text-gray-700'
                                        onClick={() => {
                                            navigate('/orders');
                                            setVisible(false);
                                        }}
                                    >
                                        <FaBoxOpen size={18} />
                                        Siparişlerim
                                    </button>
                                    <button 
                                        className='flex items-center gap-2 py-2 text-red-500'
                                        onClick={() => {
                                            logout();
                                            setVisible(false);
                                        }}
                                    >
                                        <FaSignOutAlt size={18} />
                                        Çıkış Yap
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className='mt-6 pt-6 border-t border-gray-100'>
                                <button 
                                    className='w-full py-2 bg-indigo-600 text-white rounded-md font-medium'
                                    onClick={() => {
                                        navigate('/login');
                                        setVisible(false);
                                    }}
                                >
                                    Giriş Yap
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Navbar
