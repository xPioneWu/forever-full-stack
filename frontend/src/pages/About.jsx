import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>

      <div className='text-2xl text-center pt-8 border-t'>
          <Title text1={''} text2={'HAKKIMIZDA'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
          <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
          <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
              <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque reprehenderit tempora fuga quisquam corrupti nostrum, soluta error asperiores sint nam amet illum harum nisi voluptatibus labore necessitatibus? Voluptatibus, officiis nobis.</p>
              <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloremque facere inventore doloribus similique, officia velit minus animi accusamus dicta praesentium mollitia! Deleniti quas earum enim, molestias cupiditate ducimus ullam numquam cum veniam asperiores voluptate voluptatem sit eligendi at aperiam id?</p>
              <b className='text-gray-800'>Hedefimiz</b>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Id, dolore. Iure veniam quis similique. Esse error corrupti amet quos, deserunt doloribus ipsam molestias quidem quaerat at beatae ipsa ex cumque!</p>
          </div>
      </div>

      <div className=' text-xl py-4'>
          <Title text1={'Neden'} text2={'Bizi Seçin'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Kalite: </b>
            <p className=' text-gray-600'>We meticulously select and vet each product to ensure it meets our stringent quality standards.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Kolaylık:</b>
            <p className=' text-gray-600'>With our user-friendly interface and hassle-free ordering process, shopping has never been easier.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Müşteri Hizmetleri:</b>
            <p className=' text-gray-600'>Our team of dedicated professionals is here to assist you the way, ensuring your satisfaction is our top priority.</p>
          </div>
      </div>

      <NewsletterBox/>
      
    </div>
  )
}

export default About
