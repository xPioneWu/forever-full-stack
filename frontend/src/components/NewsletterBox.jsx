import React, { useState } from 'react'
import { FaPaperPlane, FaRegEnvelope, FaCheck } from 'react-icons/fa'
import { toast } from 'react-toastify'

const NewsletterBox = () => {
    const [email, setEmail] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const onSubmitHandler = (event) => {
        event.preventDefault()
        
        if (!email || !email.includes('@')) {
            toast.error('Lütfen geçerli bir e-posta adresi girin')
            return
        }
        
        setIsLoading(true)
        
        // Simüle edilmiş API isteği
        setTimeout(() => {
            setIsLoading(false)
            setIsSubmitted(true)
            toast.success('Tebrikler! Bültenimize başarıyla abone oldunuz.')
        }, 1500)
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="md:flex">
                    {/* Sol Sütun - Görsel Bölüm */}
                    <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-8 md:p-12 text-white md:w-1/2 flex items-center">
                        <div>
                            <FaRegEnvelope className="text-4xl mb-6 text-indigo-200" />
                            <h2 className="text-3xl font-bold mb-4">Bizden Haberdar Olun</h2>
                            <p className="text-indigo-100 mb-6">
                                E-bültenimize abone olarak yeni ürünler, indirimler ve özel tekliflerden haberdar olun.
                            </p>
                            <div className="flex items-center text-sm">
                                <FaCheck className="mr-2 text-indigo-200" />
                                <span>Özel indirimler</span>
                            </div>
                            <div className="flex items-center text-sm mt-2">
                                <FaCheck className="mr-2 text-indigo-200" />
                                <span>Yeni ürün bilgilendirmeleri</span>
                            </div>
                            <div className="flex items-center text-sm mt-2">
                                <FaCheck className="mr-2 text-indigo-200" />
                                <span>İlk sipariş %20 indirim</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Sağ Sütun - Form */}
                    <div className="p-8 md:p-12 md:w-1/2 flex items-center">
                        {!isSubmitted ? (
                            <div className="w-full">
                                <h3 className="text-2xl font-semibold text-gray-800 mb-2">Abone Ol</h3>
                                <p className="text-gray-600 mb-6">
                                    Hemen kaydolun ve ilk siparişinizde %20 indirim kazanın!
                                </p>
                                <form onSubmit={onSubmitHandler} className="space-y-4">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                            E-posta Adresiniz
                                        </label>
                                        <div className="relative">
                                            <input 
                                                id="email"
                                                type="email" 
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="ornek@mail.com" 
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                                                required
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>
                                    <button 
                                        type="submit" 
                                        className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white transition-all ${
                                            isLoading 
                                                ? 'bg-indigo-400 cursor-not-allowed' 
                                                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'
                                        }`}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                İşleniyor...
                                            </>
                                        ) : (
                                            <>
                                                <span>Abone Ol</span>
                                                <FaPaperPlane />
                                            </>
                                        )}
                                    </button>
                                    <p className="text-xs text-gray-500 mt-4">
                                        Abone olarak gizlilik politikamızı kabul etmiş sayılırsınız. İstediğiniz zaman abonelikten çıkabilirsiniz.
                                    </p>
                                </form>
                            </div>
                        ) : (
                            <div className="text-center w-full">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FaCheck className="text-green-500 text-2xl" />
                                </div>
                                <h3 className="text-2xl font-semibold text-gray-800 mb-2">Teşekkürler!</h3>
                                <p className="text-gray-600 mb-6">
                                    E-bültenimize başarıyla abone oldunuz. Özel teklifler ve indirim fırsatları için e-posta kutunuzu kontrol edin.
                                </p>
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                                >
                                    Farklı bir e-posta ile abone ol
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewsletterBox
