import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { FaTrashAlt, FaTruck, FaLock, FaCreditCard, FaShoppingCart } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Cart = () => {

  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item]
            })
          }
        }
      }
      setCartData(tempData);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [cartItems, products])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className='border-t pt-8 pb-20 max-w-7xl mx-auto px-4'>
      <div className='text-center mb-8'>
        <Title text1={'SEPETİM'} text2={''} />
      </div>

      {cartData.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-8xl mb-4 text-gray-200 flex justify-center">
            <FaShoppingCart />
          </div>
          <h2 className="text-2xl font-medium mb-2">Sepetiniz boş</h2>
          <p className="text-gray-500 mb-8">Alışverişe devam etmek için aşağıdaki butona tıklayın</p>
          <button
            onClick={() => navigate('/collection')}
            className="bg-indigo-600 text-white px-8 py-3 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Alışverişe Başla
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h2 className="font-medium">Sepet Özeti ({cartData.length} ürün)</h2>
              </div>
              
              <div className="divide-y">
                {cartData.map((item, index) => {
                  const productData = products.find((product) => product._id === item._id);
                  
                  return (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 flex items-start gap-4"
                    >
                      <div className="w-20 h-20 flex-shrink-0 bg-gray-50 rounded-md overflow-hidden border">
                        <img className="w-full h-full object-cover" src={productData.image[0]} alt={productData.name} />
                      </div>
                      
                      <div className="flex-grow">
                        <h3 className="font-medium mb-1">{productData.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">Beden: <span className="font-medium">{item.size}</span></p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex border rounded-md overflow-hidden">
                              <button 
                                onClick={() => item.quantity > 1 ? updateQuantity(item._id, item.size, item.quantity - 1) : null}
                                className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700"
                              >
                                -
                              </button>
                              <input 
                                onChange={(e) => {
                                  const value = Number(e.target.value);
                                  if (value > 0) {
                                    updateQuantity(item._id, item.size, value);
                                  }
                                }} 
                                className="w-12 text-center border-x focus:outline-none" 
                                type="number" 
                                min={1} 
                                value={item.quantity} 
                              />
                              <button 
                                onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                                className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700"
                              >
                                +
                              </button>
                            </div>
                            <button 
                              onClick={() => updateQuantity(item._id, item.size, 0)} 
                              className="text-gray-400 hover:text-red-500 transition-colors"
                              aria-label="Ürünü sil"
                            >
                              <FaTrashAlt />
                            </button>
                          </div>
                          <p className="font-medium">{currency}{(productData.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-20">
              <CartTotal />
              
              <button 
                onClick={() => navigate('/place-order')} 
                className="w-full bg-indigo-600 text-white font-medium rounded-md py-3 my-4 hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <FaLock size={14} /> Siparişi Tamamla
              </button>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FaTruck className="text-gray-400" />
                  <span>Hızlı Teslimat</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FaCreditCard className="text-gray-400" />
                  <span>Güvenli Ödeme</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <button 
                  onClick={() => navigate('/collection')}
                  className="w-full border border-gray-300 text-gray-700 font-medium rounded-md py-2 hover:bg-gray-50 transition-colors"
                >
                  Alışverişe Devam Et
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
