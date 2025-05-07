import React, { useEffect } from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import BestSellingProducts from '../components/BestSellingProducts'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'
import AOS from 'aos';
import 'aos/dist/aos.css';

const Home = () => {
  // AOS kütüphanesini başlat
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8" data-aos="fade-up">
        <Hero />
      </div>

      {/* Content Sections */}
      <div className="space-y-24 py-10">
        {/* Videolar Bölümü */}
        <section className="relative overflow-hidden" data-aos="fade-up">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 -skew-y-3 transform origin-top-right"></div>
          <div className="relative z-10 py-8">
            <BestSeller />
          </div>
        </section>

        {/* Çok Satanlar Bölümü */}
        <section className="py-8" data-aos="fade-up">
          <BestSellingProducts />
        </section>

        {/* Yeni Gelenler (Kategoriler) Bölümü */}
        <section className="py-8" data-aos="fade-up" data-aos-delay="100">
          <LatestCollection />
        </section>

        {/* Politikalar Bölümü */}
        <section className="bg-white py-16 shadow-inner" data-aos="fade-up">
          <OurPolicy />
        </section>

        {/* Bülten Aboneliği Bölümü */}
        <section className="relative overflow-hidden py-8" data-aos="fade-up">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 opacity-50 rounded-3xl"></div>
          <div className="relative z-10">
            <NewsletterBox />
          </div>
        </section>
      </div>

      {/* Floating Scroll-to-Top Button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-black/80 text-white p-4 rounded-full shadow-lg hover:bg-black transition-all duration-300 backdrop-blur-sm"
      >
        ↑
      </button>
    </div>
  )
}

export default Home
