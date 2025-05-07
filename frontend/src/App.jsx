import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './components/Navbar'
import SearchBar from './components/SearchBar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import VideoFeed from './pages/VideoFeed'
import Verify from './pages/Verify'
import Profile from './pages/Profile'
import { ShopContextProvider } from './context/ShopContext'
import LiveChat from './components/LiveChat'
import ScrollToTop from './components/ScrollToTop'

export const backendUrl = "http://localhost:4000"

const App = () => {
  const location = useLocation();
  const isVideoFeedPage = location.pathname === '/video-feed';
  const containerClass = isVideoFeedPage ? 'min-h-screen bg-gray-900' : 'min-h-screen bg-white';

  return (
    <ShopContextProvider>
      <div className={containerClass}>
        <ToastContainer />
        {/* Navbar ve SearchBar sadece video sayfasında değilsek göster */}
        {!isVideoFeedPage && (
          <>
            <Navbar />
            <SearchBar />
          </>
        )}
        
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/collection' element={<Collection />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/product/:productId' element={<Product />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/login' element={<Login />} />
          <Route path='/place-order' element={<PlaceOrder />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/verify' element={<Verify />} />
          <Route path='/video-feed' element={<VideoFeed />} />
          <Route path='/profile' element={<Profile />} />
        </Routes>
        
        {/* Footer sadece video sayfasında değilsek göster */}
        {!isVideoFeedPage && <Footer />}
        
        {/* Canlı destek ve yukarı kaydırma butonları */}
        <LiveChat />
        <ScrollToTop />
      </div>
    </ShopContextProvider>
  )
}

export default App
