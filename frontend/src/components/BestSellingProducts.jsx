import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const BestSellingProducts = () => {
    const { products } = useContext(ShopContext);
    
    // En çok satan ürünleri filtreleme (bestseller: true olan ürünleri al)
    const bestSellerProducts = products.filter(product => product.bestseller).slice(0, 5);

    return (
        <div className='my-10 container mx-auto px-4'>
            <div className='text-center py-8 text-3xl'>
                <Title text1={'Çok'} text2={'Satanlar'} />
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                    Müşterilerimizin en çok tercih ettiği kaliteli ürünlerimizi keşfedin.
                </p>
            </div>
            
            {bestSellerProducts.length > 0 ? (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4'>
                    {bestSellerProducts.map((product, index) => (
                        <div key={index} className="group transition-all duration-300 hover:shadow-lg rounded-lg">
                            <ProductItem 
                                id={product._id} 
                                image={product.image} 
                                name={product.name} 
                                price={product.price} 
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className='text-center py-6 bg-gray-50 rounded-xl'>
                    <p className='text-gray-600'>Henüz çok satan ürün bulunmamaktadır.</p>
                </div>
            )}

            <div className='text-center mt-6'>
                <Link 
                    to='/collection'
                    className='inline-block px-6 py-3 border border-gray-800 text-gray-800 rounded-lg hover:bg-gray-800 hover:text-white transition-all duration-300'
                >
                    Tüm Ürünleri Görüntüle
                </Link>
            </div>
        </div>
    );
};

export default BestSellingProducts; 