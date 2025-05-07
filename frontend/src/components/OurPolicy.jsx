import React from 'react'
import { assets } from '../assets/assets'

const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700'>
      
      <div>
        <img src={assets.exchange_icon} className='w-12 m-auto mb-5' alt="" />
        <p className=' font-semibold'>Değişim Politikamız</p>
        <p className=' text-gray-400'>Bedava Değişim Hizmeti</p>
      </div>
      <div>
        <img src={assets.quality_icon} className='w-12 m-auto mb-5' alt="" />
        <p className=' font-semibold'>7 Gün İçinde Geri Dönüş</p>
        <p className=' text-gray-400'>7 Gün İçinde Değişim Hizmeti</p>
      </div>
      <div>
        <img src={assets.support_img} className='w-12 m-auto mb-5' alt="" />
        <p className=' font-semibold'>En İyi Müşteri Hizmetleri</p>
        <p className=' text-gray-400'>7/24 Müşteri Hizmetleri İmkanı</p>
      </div>

    </div>
  )
}

export default OurPolicy
