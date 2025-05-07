import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'

const CartTotal = () => {
    const {currency, delivery_fee, getCartAmount} = useContext(ShopContext);

    return (
        <div className='w-full'>
            <h2 className='font-medium text-lg mb-4'>Sipariş Özeti</h2>

            <div className='flex flex-col gap-3 text-sm'>
                <div className='flex justify-between'>
                    <p className='text-gray-600'>Ara Toplam</p>
                    <p>{currency}{getCartAmount().toFixed(2)}</p>
                </div>
                
                <div className='flex justify-between'>
                    <p className='text-gray-600'>Kargo Ücreti</p>
                    <p>{getCartAmount() === 0 ? 'Ücretsiz' : `${currency}${delivery_fee.toFixed(2)}`}</p>
                </div>
                
                {getCartAmount() > 150 && (
                    <div className='flex justify-between text-green-600'>
                        <p>Kargo İndirimi</p>
                        <p>-{currency}{delivery_fee.toFixed(2)}</p>
                    </div>
                )}
                
                <div className='border-t border-b py-3 my-2'>
                    <div className='flex justify-between font-medium'>
                        <p>Toplam</p>
                        <p>{currency}{(getCartAmount() === 0 
                            ? 0 
                            : getCartAmount() > 150 
                                ? getCartAmount() 
                                : getCartAmount() + delivery_fee
                        ).toFixed(2)}</p>
                    </div>
                    
                    <div className='text-xs text-gray-500 mt-2'>
                        <p>* Fiyatlara KDV dahildir</p>
                        {getCartAmount() < 150 && getCartAmount() > 0 && (
                            <p className='text-indigo-600 mt-1'>
                                {currency}{(150 - getCartAmount()).toFixed(2)} daha ekleyin, kargo bedava!
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartTotal
