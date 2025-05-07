import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Logo & About */}
          <div>
            <img src={assets.logo} className="h-12 mb-6" alt="Forever Mağazası" />
            <p className="text-gray-600 mb-6">
              Eviniz için en kaliteli bambu ve cam ürünleri sunuyoruz. Müşteri memnuniyeti ve ürün kalitesi bizim önceliğimizdir.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-gray-900">Hızlı Bağlantılar</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-600 hover:text-indigo-600 transition-colors">Anasayfa</Link>
              </li>
              <li>
                <Link to="/collection" className="text-gray-600 hover:text-indigo-600 transition-colors">Ürünlerimiz</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-indigo-600 transition-colors">Hakkımızda</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-indigo-600 transition-colors">İletişim</Link>
              </li>
              <li>
                <Link to="/video-feed" className="text-gray-600 hover:text-indigo-600 transition-colors">Video İçeriklerimiz</Link>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Customer Service */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-gray-900">Müşteri Hizmetleri</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Gizlilik Politikası</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">İade Politikası</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Kargo Bilgileri</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">SSS</a>
              </li>
            </ul>
          </div>
          
          {/* Column 4: Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-gray-900">İletişim Bilgileri</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-indigo-600 mt-1 mr-3" />
                <span className="text-gray-600">Güzeltepe Mah. Sinpaş Sokak No: 35, Eyüpsultan/İstanbul</span>
              </li>
              <li className="flex items-center">
                <FaPhoneAlt className="text-indigo-600 mr-3" />
                <span className="text-gray-600">+90 (212) 456 7890</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-indigo-600 mr-3" />
                <span className="text-gray-600">iletisim@forever.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Newsletter Section */}
        <div className="border-t border-b border-gray-200 py-8 my-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Bültenimize Abone Olun</h3>
              <p className="text-gray-600">İndirimlerden ve yeni ürünlerden ilk siz haberdar olun.</p>
            </div>
            <div className="flex-1 max-w-md">
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="E-posta adresiniz" 
                  className="flex-1 px-4 py-3 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                />
                <button className="bg-indigo-600 text-white px-6 py-3 rounded-r-md hover:bg-indigo-700 transition-colors">
                  Abone Ol
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright & Bottom Links */}
        <div className="md:flex md:items-center md:justify-between text-sm">
          <div className="text-gray-500 mb-4 md:mb-0">
            &copy; {currentYear} Forever Mağazası. Tüm Hakları Saklıdır.
          </div>
          <div className="flex flex-wrap gap-4">
            <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">
              Şartlar ve Koşullar
            </a>
            <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">
              Gizlilik Politikası
            </a>
            <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">
              Çerez Politikası
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
