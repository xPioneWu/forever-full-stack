import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUser, FaLock, FaEnvelope, FaGoogle, FaFacebook } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext)

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    
    try {
      if (!isLogin) {
        // Kayıt olma işlemi
        if (password !== confirmPassword) {
          toast.error('Şifreler eşleşmiyor!');
          setLoading(false);
          return;
        }
        
        const response = await axios.post(backendUrl + '/api/user/register', { name, email, password })
        if (response.data.success) {
          toast.success('Kayıt başarılı! Giriş yapılıyor...');
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
        } else {
          toast.error(response.data.message)
        }
      } else {
        // Giriş yapma işlemi
        const response = await axios.post(backendUrl + '/api/user/login', { email, password })
        if (response.data.success) {
          toast.success('Giriş başarılı!');
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
        } else {
          toast.error(response.data.message)
        }
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])

  const switchMode = () => {
    setIsLogin(!isLogin);
    // Form alanlarını temizle
    setEmail('');
    setPassword('');
    setName('');
    setConfirmPassword('');
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl'
      >
        <div className='text-center'>
          <h2 className='text-3xl font-bold text-gray-900'>
            {isLogin ? 'Hoş Geldiniz' : 'Hesap Oluştur'}
          </h2>
          <p className='mt-2 text-sm text-gray-600'>
            {isLogin 
              ? "Hesabınıza giriş yapın" 
              : "Yeni bir hesap oluşturmak için bilgilerinizi girin"}
          </p>
        </div>

        <form onSubmit={onSubmitHandler} className='mt-8 space-y-6'>
          <div className='space-y-4'>
            {/* İsim alanı - Sadece kayıt olurken gösterilir */}
            {!isLogin && (
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <FaUser className='text-gray-400' />
                </div>
                <input
                  type="text"
                  required
                  className='appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                  placeholder='Ad Soyad'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            
            {/* E-posta alanı */}
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <FaEnvelope className='text-gray-400' />
              </div>
              <input 
                type="email" 
                required
                className='appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                placeholder='E-posta'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            {/* Şifre alanı */}
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <FaLock className='text-gray-400' />
              </div>
              <input 
                type="password" 
                required
                className='appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                placeholder='Şifre'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            {/* Şifre onay alanı - Sadece kayıt olurken gösterilir */}
            {!isLogin && (
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <FaLock className='text-gray-400' />
                </div>
                <input
                  type="password"
                  required
                  className='appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                  placeholder='Şifreyi Onayla'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className='flex items-center justify-between'>
            {isLogin && (
              <div className='flex items-center'>
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
                />
                <label htmlFor="remember-me" className='ml-2 block text-sm text-gray-700'>
                  Beni hatırla
                </label>
              </div>
            )}
            
            {isLogin && (
              <div className='text-sm'>
                <a href="#" className='font-medium text-indigo-600 hover:text-indigo-500'>
                  Şifremi unuttum
                </a>
              </div>
            )}
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className='group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
            </button>
          </div>
          
          <div className='flex items-center justify-center mt-4'>
            <span className='text-sm text-gray-600'>
              {isLogin ? 'Hesabınız yok mu?' : 'Zaten hesabınız var mı?'}
            </span>
            <button
              type="button"
              onClick={switchMode}
              className='ml-2 text-sm font-medium text-indigo-600 hover:text-indigo-500'
            >
              {isLogin ? 'Kayıt Ol' : 'Giriş Yap'}
            </button>
          </div>
          
          <div className='mt-6'>
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300'></div>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-white text-gray-500'>
                  veya şununla devam et
                </span>
              </div>
            </div>

            <div className='mt-6 grid grid-cols-2 gap-3'>
              <div>
                <a
                  href="#"
                  className='w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50'
                >
                  <FaGoogle className='text-red-500 mr-2' />
                  Google
                </a>
              </div>
              <div>
                <a
                  href="#"
                  className='w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50'
                >
                  <FaFacebook className='text-blue-600 mr-2' />
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default Login
