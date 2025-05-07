import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'

const Hero = () => {
  return (
    <div className='relative overflow-hidden rounded-xl shadow-2xl'>
      {/* Background ve Overlay */}
      <div className='absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/30 z-10'></div>
      
      {/* Hero Content */}
      <div className='flex flex-col md:flex-row min-h-[400px] relative z-20'>
        <div className='w-full md:w-1/2 flex items-center p-8 md:p-12'>
          <div className='text-gray-800 max-w-lg'>
            <div className='inline-block bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full mb-4'>
              <p className='font-medium text-sm md:text-base text-indigo-700'>Yeni Koleksiyon</p>
            </div>
            
            <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight'>
              <span className='text-gray-900'>Bambu ve Cam</span>
              <br />
              <span className='bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600'>
                Ürünlerimiz
              </span>
            </h1>
            
            <p className='mb-8 text-gray-700 text-lg max-w-md'>
              En kaliteli bambu ve cam ürünlerimizle evinizi güzelleştirin. Eşsiz tasarımlar ve uygun fiyatlar.
            </p>
            
            <div className='flex flex-wrap gap-4'>
              <Link 
                to="/collection" 
                className='px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl flex items-center gap-2 group'
              >
                <span>Alışverişe Başla</span>
                <FaArrowRight className='group-hover:translate-x-1 transition-transform' />
              </Link>
              
              <Link 
                to="/video-feed" 
                className='px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-2'
              >
                <span>Videoları İzle</span>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Hero Image */}
        <div className='w-full md:w-1/2 h-64 md:h-auto overflow-hidden'>
          <img 
            className='w-full h-full object-cover transform hover:scale-105 transition-transform duration-700' 
            src={assets.hero_img} 
            alt="Yeni Gelenler" 
          />
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className='absolute top-10 right-10 w-24 h-24 bg-yellow-400 rounded-full opacity-20 blur-xl'></div>
      <div className='absolute bottom-10 left-10 w-32 h-32 bg-indigo-400 rounded-full opacity-20 blur-xl'></div>
    </div>
  )
}

export default Hero
