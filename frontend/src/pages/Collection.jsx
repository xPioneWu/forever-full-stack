import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import ProductItem from '../components/ProductItem';
import { FiFilter, FiX, FiChevronDown, FiChevronUp, FiCheck, FiDollarSign } from 'react-icons/fi';
import { FaSortAmountDown, FaSortAmountUpAlt } from 'react-icons/fa';

const FilterChip = ({ label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
      active 
        ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' 
        : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
    }`}
  >
    {label}
  </button>
);

const Collection = () => {
  const { products, search, showSearch, currency } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relavent');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [priceInput, setPriceInput] = useState({ min: '', max: '' });
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    subCategory: true,
    price: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value));
    } else {
      setCategory(prev => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory(prev => prev.filter(item => item !== e.target.value));
    } else {
      setSubCategory(prev => [...prev, e.target.value]);
    }
  };

  const clearFilters = () => {
    setCategory([]);
    setSubCategory([]);
    setPriceRange({ min: 0, max: 1000 });
    setPriceInput({ min: '', max: '' });
  };

  // Fiyat aralığı değişikliğini yakala
  const handlePriceInputChange = (type, value) => {
    setPriceInput(prev => ({
      ...prev,
      [type]: value
    }));
  };

  // Fiyat aralığı uygula
  const applyPriceRange = () => {
    const min = priceInput.min === '' ? 0 : Number(priceInput.min);
    const max = priceInput.max === '' ? 9999999 : Number(priceInput.max);
    
    if (min >= 0 && max >= min) {
      setPriceRange({ min, max });
    }
  };

  // Enter tuşuna basıldığında fiyat aralığını uygula
  const handlePriceKeyDown = (e) => {
    if (e.key === 'Enter') {
      applyPriceRange();
    }
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => 
        category.includes(item.category)
      );
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(item => 
        subCategory.includes(item.subCategory)
      );
    }

    // Fiyat aralığı filtresi
    if (priceRange.min > 0 || priceRange.max < 9999999) {
      productsCopy = productsCopy.filter(item => 
        item.price >= priceRange.min && item.price <= priceRange.max
      );
    }

    setFilterProducts(productsCopy);
  };

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a, b) => (a.price - b.price)));
        break;

      case 'high-low':
        setFilterProducts(fpCopy.sort((a, b) => (b.price - a.price)));
        break;

      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products, priceRange]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <div className='min-h-screen bg-gray-50 py-10'>
      <div className='container mx-auto px-4'>
        <div className='mb-8'>
          <h1 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>Ürün Koleksiyonu</h1>
          <p className='text-gray-600 max-w-2xl'>
            Özenle seçilmiş ürünlerimizi keşfedin. Evinizin veya işyerinizin ihtiyacına göre filtreleme yapabilirsiniz.
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className='flex justify-between items-center mb-6 lg:hidden'>
          <button 
            className='flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200'
            onClick={() => setShowFilter(!showFilter)}
          >
            {showFilter ? <FiX size={18} /> : <FiFilter size={18} />}
            <span>Filtreler</span>
          </button>

          <select 
            onChange={(e) => setSortType(e.target.value)}
            className='bg-white border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20'
          >
            <option value="relavent">Öne Çıkanlar</option>
            <option value="low-high">Fiyat: Düşük - Yüksek</option>
            <option value="high-low">Fiyat: Yüksek - Düşük</option>
          </select>
        </div>

        {/* Active Filters */}
        {(category.length > 0 || subCategory.length > 0 || priceRange.min > 0 || priceRange.max < 1000) && (
          <div className='mb-6'>
            <div className='flex flex-wrap items-center gap-2'>
              <span className='text-sm text-gray-600 mr-2'>Aktif Filtreler:</span>
              
              {category.map(cat => (
                <FilterChip 
                  key={cat} 
                  label={cat} 
                  active={true} 
                  onClick={() => setCategory(prev => prev.filter(c => c !== cat))} 
                />
              ))}
              
              {subCategory.map(subCat => (
                <FilterChip 
                  key={subCat} 
                  label={subCat} 
                  active={true} 
                  onClick={() => setSubCategory(prev => prev.filter(sc => sc !== subCat))} 
                />
              ))}
              
              {(priceRange.min > 0 || priceRange.max < 1000) && (
                <FilterChip 
                  label={`${currency}${priceRange.min} - ${currency}${priceRange.max}`} 
                  active={true} 
                  onClick={() => setPriceRange({ min: 0, max: 1000 })} 
                />
              )}
              
              <button 
                onClick={clearFilters}
                className='text-sm text-red-600 hover:text-red-800 font-medium ml-2'
              >
                Temizle
              </button>
            </div>
          </div>
        )}

        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Filters Panel */}
          <div className={`lg:w-72 lg:block ${showFilter ? 'block' : 'hidden'}`}>
            <div className='sticky top-24 bg-white rounded-xl shadow-sm overflow-hidden'>
              <div className='p-5 border-b flex justify-between items-center'>
                <h2 className='text-lg font-semibold'>Filtreler</h2>
                <button 
                  onClick={clearFilters}
                  className='text-sm text-gray-500 hover:text-gray-800'
                >
                  Tümünü Temizle
                </button>
              </div>

              {/* Category Filter */}
              <div className='border-b'>
                <button 
                  className='w-full px-5 py-4 flex justify-between items-center hover:bg-gray-50'
                  onClick={() => toggleSection('category')}
                >
                  <span className='font-medium'>Kategori</span>
                  {expandedSections.category ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                
                {expandedSections.category && (
                  <div className='px-5 pb-4 pt-1'>
                    <div className='space-y-3'>
                      {['cam', 'bambu', 'bıçak', 'mutfak'].map(cat => (
                        <label key={cat} className='flex items-center gap-3 cursor-pointer group'>
                          <div className={`w-5 h-5 rounded border ${category.includes(cat) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 group-hover:border-indigo-400'} flex items-center justify-center transition-colors`}>
                            {category.includes(cat) && <FiCheck className='text-white' size={14} />}
                          </div>
                          <input 
                            type="checkbox" 
                            className='hidden' 
                            value={cat} 
                            checked={category.includes(cat)}
                            onChange={toggleCategory}
                          />
                          <span className='text-gray-700'>{cat === 'cam' ? 'Cam' : cat === 'bambu' ? 'Bambu' : cat === 'bıçak' ? 'Bıçak' : 'Mutfak Eşyaları'}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* SubCategory Filter */}
              <div className='border-b'>
                <button 
                  className='w-full px-5 py-4 flex justify-between items-center hover:bg-gray-50'
                  onClick={() => toggleSection('subCategory')}
                >
                  <span className='font-medium'>Tür</span>
                  {expandedSections.subCategory ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                
                {expandedSections.subCategory && (
                  <div className='px-5 pb-4 pt-1'>
                    <div className='space-y-3'>
                      {['dükkan', 'ev'].map(subCat => (
                        <label key={subCat} className='flex items-center gap-3 cursor-pointer group'>
                          <div className={`w-5 h-5 rounded border ${subCategory.includes(subCat) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 group-hover:border-indigo-400'} flex items-center justify-center transition-colors`}>
                            {subCategory.includes(subCat) && <FiCheck className='text-white' size={14} />}
                          </div>
                          <input 
                            type="checkbox" 
                            className='hidden' 
                            value={subCat} 
                            checked={subCategory.includes(subCat)}
                            onChange={toggleSubCategory}
                          />
                          <span className='text-gray-700'>{subCat === 'dükkan' ? 'Dükkan' : 'Ev'}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Price Range Filter */}
              <div className='border-b'>
                <button 
                  className='w-full px-5 py-4 flex justify-between items-center hover:bg-gray-50'
                  onClick={() => toggleSection('price')}
                >
                  <span className='font-medium'>Fiyat Aralığı</span>
                  {expandedSections.price ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                
                {expandedSections.price && (
                  <div className='px-5 pb-4 pt-1'>
                    <div className='mb-4'>
                      <div className='flex items-center justify-between mb-2'>
                        <div className='relative'>
                          <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'>{currency}</span>
                          <input
                            type="number"
                            className='pl-7 pr-2 py-2 border rounded-md w-24 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500'
                            placeholder="Min"
                            min="0"
                            value={priceInput.min}
                            onChange={(e) => handlePriceInputChange('min', e.target.value)}
                            onKeyDown={handlePriceKeyDown}
                          />
                        </div>
                        <span className='text-gray-500'>-</span>
                        <div className='relative'>
                          <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'>{currency}</span>
                          <input
                            type="number"
                            className='pl-7 pr-2 py-2 border rounded-md w-24 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500'
                            placeholder="Max"
                            min="0"
                            value={priceInput.max}
                            onChange={(e) => handlePriceInputChange('max', e.target.value)}
                            onKeyDown={handlePriceKeyDown}
                          />
                        </div>
                      </div>
                      <button
                        onClick={applyPriceRange}
                        className='w-full py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors'
                      >
                        Uygula
                      </button>
                    </div>
                    
                    <div className='flex justify-between text-sm text-gray-500 mb-1'>
                      <span>{currency}0</span>
                      <span>{currency}250</span>
                      <span>{currency}500</span>
                      <span>{currency}750</span>
                      <span>{currency}1000+</span>
                    </div>
                    <div className='h-2 bg-gray-200 rounded-full mb-4 relative'>
                      <div 
                        className='absolute h-full bg-indigo-500 rounded-full' 
                        style={{
                          left: `${(priceRange.min / 1000) * 100}%`,
                          right: `${100 - (priceRange.max / 1000) * 100}%`
                        }}
                      ></div>
                    </div>
                    <div className='text-center text-sm text-gray-600'>
                      Seçilen aralık: <span className='font-medium'>{currency}{priceRange.min} - {currency}{priceRange.max === 9999999 ? '1000+' : priceRange.max}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className='flex-1'>
            <div className='hidden lg:flex justify-between items-center mb-6'>
              <p className='text-gray-600'><span className='font-medium'>{filterProducts.length}</span> ürün bulundu</p>
              
              <div className='flex items-center gap-3'>
                <span className='text-sm text-gray-600'>Sıralama:</span>
                <select 
                  onChange={(e) => setSortType(e.target.value)}
                  className='bg-white border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20'
                >
                  <option value="relavent">Öne Çıkanlar</option>
                  <option value="low-high">Fiyat: Düşük - Yüksek</option>
                  <option value="high-low">Fiyat: Yüksek - Düşük</option>
                </select>
              </div>
            </div>

            {filterProducts.length === 0 ? (
              <div className='bg-white rounded-xl p-10 text-center shadow-sm'>
                <div className='w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                  <FiFilter size={30} className='text-gray-400' />
                </div>
                <h3 className='text-xl font-medium text-gray-800 mb-2'>Ürün Bulunamadı</h3>
                <p className='text-gray-600 mb-6'>Arama kriterlerinize uygun ürün bulunamadı. Lütfen filtrelerinizi değiştirin.</p>
                <button 
                  onClick={clearFilters}
                  className='px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all'
                >
                  Filtreleri Temizle
                </button>
              </div>
            ) : (
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {filterProducts.map((product) => (
                  <div key={product._id} className='group'>
                    <div className='relative overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-md transform hover:-translate-y-1'>
                      <ProductItem name={product.name} id={product._id} price={product.price} image={product.image} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Collection
