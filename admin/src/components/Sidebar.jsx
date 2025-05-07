import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaHome, FaBox, FaShoppingCart, FaUsers, FaImages, FaComments, FaVideo, FaTags } from 'react-icons/fa'

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: <FaHome />, label: 'Dashboard' },
    { path: '/products', icon: <FaBox />, label: 'Ürünler' },
    { path: '/addvideo', icon: <FaVideo />, label: 'Videolar' },
    { path: '/categories', icon: <FaTags />, label: 'Kategoriler' },
    { path: '/orders', icon: <FaShoppingCart />, label: 'Siparişler' },
    { path: '/users', icon: <FaUsers />, label: 'Kullanıcılar' },
    { path: '/sliders', icon: <FaImages />, label: 'Slider' },
    { path: '/live-chat', icon: <FaComments />, label: 'Canlı Destek' },
  ];

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="text-xl font-bold mb-8">Admin Panel</div>
      <nav>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 p-3 rounded-lg mb-2 transition-colors ${
              location.pathname === item.path
                ? 'bg-blue-600'
                : 'hover:bg-gray-700'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar