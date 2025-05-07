import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa'

const Navbar = ({setToken}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <div className='flex items-center py-2 px-[4%] justify-between'>
        <img className='w-[max(10%,80px)]' src={assets.logo} alt="" />
        
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)} 
            className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full p-2"
          >
            <FaUser className="text-gray-700" />
          </button>
          
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <Link 
                to="/profile" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={() => setShowProfileMenu(false)}
              >
                <FaUser className="mr-2" /> Profil
              </Link>
              <button
                onClick={() => setToken('')}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <FaSignOutAlt className="mr-2" /> Çıkış Yap
              </button>
            </div>
          )}
        </div>
    </div>
  )
}

export default Navbar