import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import { motion } from 'framer-motion'

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header Section */}
      <div className='relative py-16  text-white overflow-hidden'>
        <div className='relative z-10 text-center'>
          <Title text1={'Bize'} text2={'Ulaşın'} className="text-white" />
        </div>
        <div className='absolute inset-0 bg-[url("/path/to/pattern.svg")] opacity-10'></div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
        <div className='flex flex-col md:flex-row gap-16 items-center'>
          {/* Image Section */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className='w-full md:w-1/2'
          >
            <img 
              className='w-full rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-500' 
              src={assets.contact_img} 
              alt="Contact Us" 
            />
          </motion.div>

          {/* Contact Information */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className='w-full md:w-1/2 space-y-8'
          >
            {/* Store Information */}
            <div className='space-y-6'>
              <h3 className='text-3xl font-bold text-gray-800'>Mağazamız</h3>
              <div className='space-y-4 text-gray-600'>
                <p className='flex items-center gap-3'>
                  <span className='w-8 h-8 bg-black text-white rounded-full flex items-center justify-center'>📍</span>
                  Lorem ipsum dolor sit amet consectetur adipisicing.
                </p>
                <p className='flex items-center gap-3'>
                  <span className='w-8 h-8 bg-black text-white rounded-full flex items-center justify-center'>📞</span>
                  Lorem ipsum dolor sit amet.
                </p>
                <p className='flex items-center gap-3'>
                  <span className='w-8 h-8 bg-black text-white rounded-full flex items-center justify-center'>✉️</span>
                  Lorem, ipsum.
                </p>
              </div>
            </div>

            {/* Careers Section */}
            <div className='space-y-6 pt-8 border-t'>
              <h3 className='text-3xl font-bold text-gray-800'>Bizle Çalışın</h3>
              <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur.</p>
              <button className='group relative px-8 py-4 bg-black text-white rounded-lg overflow-hidden'>
                <span className='relative z-10'>İş Bulun</span>
                <div className='absolute inset-0 bg-white transform translate-y-full transition-transform group-hover:translate-y-0'></div>
                <span className='absolute inset-0 flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity'>
                  Explore Jobs →
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className='mt-20 bg-gradient-to-r from-gray-100 to-gray-200'>
        <NewsletterBox />
      </div>
    </div>
  )
}

export default Contact
