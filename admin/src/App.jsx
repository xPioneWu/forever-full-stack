import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Login from './components/Login'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddVideo from './pages/AddVideo'
import AddCategory from './pages/AddCategory'
import SliderManager from './components/SliderManager'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Users from './pages/Users'
import Sliders from './pages/Sliders'
import LiveChatManager from './components/LiveChatManager'
import PrivateRoute from './components/PrivateRoute'
import Profile from './pages/Profile'
import ProductDetail from './pages/ProductDetail'

// Backend URL'ini doğru formatta ayarlamak için
let backendUrlFromEnv = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
// URL'in /api ile bitip bitmediğini kontrol et
if (backendUrlFromEnv.endsWith('/api')) {
  backendUrlFromEnv = backendUrlFromEnv.slice(0, -4); // Son 4 karakteri (yani /api) kaldır
}
export const backendUrl = backendUrlFromEnv;
export const currency = '₺'

// Uygulama yüklenirken backend URL'ini loglayalım
console.log('Backend URL:', backendUrl);

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):'');

  useEffect(()=>{
    localStorage.setItem('token',token)
  },[token])

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      {token === ""
        ? <Login setToken={setToken} />
        : <>
          <Navbar setToken={setToken} />
          <hr />
          <div className='flex w-full'>
            <Sidebar />
            <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
              <Routes>
                <Route path='/add' element={<Add token={token} />} />
                <Route path='/list' element={<List token={token} />} />
                <Route path='/orders' element={<Orders token={token} />} />
                <Route path='/addvideo' element={<AddVideo token={token} />} />
                <Route path='/categories' element={<AddCategory token={token} />} />
                <Route path='/slider' element={<SliderManager token={token} />} />
                <Route path='/dashboard' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path='/products' element={<Products token={token} />} />
                <Route path='/products/:id' element={<ProductDetail token={token} />} />
                <Route path='/profile' element={<Profile token={token} />} />
                <Route path='/users' element={<PrivateRoute><Users /></PrivateRoute>} />
                <Route path='/sliders' element={<PrivateRoute><Sliders /></PrivateRoute>} />
                <Route path='/live-chat' element={<PrivateRoute><LiveChatManager token={token} /></PrivateRoute>} />
              </Routes>
            </div>
          </div>
        </>
      }
    </div>
  )
}

export default App