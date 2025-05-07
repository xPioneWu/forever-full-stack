import React, { useState, useEffect } from 'react'
import {assets} from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { FaTrash, FaEdit, FaSync, FaExclamationTriangle } from 'react-icons/fa'
import { useLocation, useNavigate } from 'react-router-dom'

const Add = ({token}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const editId = queryParams.get('edit');
  const [isEditMode, setIsEditMode] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [error, setError] = useState(null);

  const [image1,setImage1] = useState(false)
  const [image2,setImage2] = useState(false)
  const [image3,setImage3] = useState(false)
  const [image4,setImage4] = useState(false)

   const [name, setName] = useState("");
   const [description, setDescription] = useState("");
   const [price, setPrice] = useState("");
   const [category, setCategory] = useState("bambu");
   const [subCategory, setSubCategory] = useState("Topwear");
   const [bestseller, setBestseller] = useState(false);
   const [sizes, setSizes] = useState([]);
   const [products, setProducts] = useState([]);
   const [loading, setLoading] = useState(true);

   // Düzenlenecek ürünü yükle
   useEffect(() => {
     if (editId) {
       setIsEditMode(true);
       setLoadingProduct(true);
       setError(null);
       fetchProductDetails(editId);
     }
   }, [editId]);

   const fetchProductDetails = async (productId) => {
     try {
       setLoadingProduct(true);
       setError(null);
       console.log(`Ürün detayları alınıyor... ID: ${productId}`);
       console.log(`API Endpoint: ${backendUrl}/api/product/single/${productId}`);
       
       const response = await axios.get(`${backendUrl}/api/product/single/${productId}`);
       console.log("Sunucudan gelen yanıt:", response.data);
       
       if (response.data.success) {
         const product = response.data.product;
         
         if (!product) {
           console.error("Sunucu başarılı yanıt verdi fakat ürün verisi yok:", response.data);
           setError("Ürün bilgileri alınamadı. Sunucu yanıtında ürün verisi bulunamadı.");
           toast.error("Ürün verisi bulunamadı.");
           return;
         }
         
         console.log("Alınan ürün bilgileri:", product);
         
         setName(product.name || "");
         setDescription(product.description || "");
         setPrice(product.price || "");
         setCategory(product.category || "bambu");
         setSubCategory(product.subCategory || "Topwear");
         setBestseller(product.bestseller || false);
         setSizes(product.sizes || []);
         
         // Resimler için URL'leri tutuyoruz, gerçek dosyalar değil
         // Bu resimler düzenleme sırasında arayüzde gösterilecek
         if (product.images && product.images.length > 0) {
           console.log("Ürün resimleri:", product.images);
           // URL'leri göstermek için özel durum
           product.images.forEach((url, index) => {
             if (index === 0) setImage1({preview: url, isExisting: true, url});
             if (index === 1) setImage2({preview: url, isExisting: true, url});
             if (index === 2) setImage3({preview: url, isExisting: true, url});
             if (index === 3) setImage4({preview: url, isExisting: true, url});
           });
         } else if (product.image && product.image.length > 0) {
           console.log("Ürün resim dizisi (alternatif):", product.image);
           // Bazı ürünlerde images yerine image dizisi kullanılmış olabilir
           product.image.forEach((url, index) => {
             if (index === 0) setImage1({preview: url, isExisting: true, url});
             if (index === 1) setImage2({preview: url, isExisting: true, url});
             if (index === 2) setImage3({preview: url, isExisting: true, url});
             if (index === 3) setImage4({preview: url, isExisting: true, url});
           });
         } else {
           console.log("Ürün için resim bulunamadı");
         }
       } else {
         const errorMsg = response.data.message || "Ürün yüklenirken bir hata oluştu";
         console.error("Sunucu hata mesajı:", errorMsg);
         setError(errorMsg);
         toast.error(errorMsg);
         
         if (response.data.message && response.data.message.includes("bulunamadı")) {
           // Ürün bulunamadı hatası, ana sayfaya yönlendir
           navigate('/products');
         }
       }
     } catch (error) {
       console.error("Ürün detayı yükleme hatası:", error);
       const errorMsg = error.response?.data?.message || error.message || "Ürün yüklenirken bir hata oluştu";
       setError(errorMsg);
       toast.error(errorMsg);
       
       // API isteği sırasında ciddi bir hata oluştu, ana sayfaya yönlendir
       if (error.response?.status === 404 || error.response?.status === 400) {
         navigate('/products');
       }
     } finally {
       setLoadingProduct(false);
     }
   };

   const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(backendUrl + "/api/product/list");
      
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message || "Ürünler yüklenirken bir hata oluştu");
      }
    } catch (error) {
      console.error("Ürün listeleme hatası:", error);
      toast.error("Ürünler yüklenirken bir hata oluştu");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

   const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      
      const formData = new FormData()

      formData.append("name",name)
      formData.append("description",description)
      formData.append("price",price)
      formData.append("category",category)
      formData.append("subCategory",subCategory)
      formData.append("bestseller",bestseller)
      formData.append("sizes",JSON.stringify(sizes))

      // Düzenleme modunda mevcut resimler için URL bilgisini ekleyelim
      if (isEditMode) {
        const existingImages = [];
        if (image1 && image1.isExisting) existingImages.push(image1.url);
        if (image2 && image2.isExisting) existingImages.push(image2.url);
        if (image3 && image3.isExisting) existingImages.push(image3.url);
        if (image4 && image4.isExisting) existingImages.push(image4.url);
        
        if (existingImages.length > 0) {
          formData.append("existingImages", JSON.stringify(existingImages));
        }
      }

      // Sadece gerçek dosya olan resimleri ekleyelim
      if (image1 && !image1.isExisting) formData.append("image1", image1);
      if (image2 && !image2.isExisting) formData.append("image2", image2);
      if (image3 && !image3.isExisting) formData.append("image3", image3);
      if (image4 && !image4.isExisting) formData.append("image4", image4);

      let response;
      
      if (isEditMode) {
        // Düzenleme modu
        formData.append("productId", editId);
        response = await axios.post(
          backendUrl + "/api/product/update",
          formData,
          {headers: {token, 'Content-Type': 'multipart/form-data'}}
        );
      } else {
        // Ekleme modu
        response = await axios.post(
          backendUrl + "/api/product/add",
          formData,
          {headers: {token, 'Content-Type': 'multipart/form-data'}}
        );
      }

      if (response.data.success) {
        toast.success(response.data.message)
        setName('')
        setDescription('')
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setPrice('')
        setCategory("bambu")
        setSubCategory("Topwear")
        setBestseller(false)
        setSizes([])
        setIsEditMode(false)
        // Ürün ekledikten sonra listeyi yenile
        fetchProducts();
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
   }

   // Ürün silme fonksiyonu
   const handleDeleteProduct = async (productId) => {
    if (window.confirm("Bu ürünü silmek istediğinizden emin misiniz?")) {
      try {
        const response = await axios.post(
          backendUrl + "/api/product/remove", 
          { productId }, 
          { headers: { token } }
        );
        
        if (response.data.success) {
          toast.success("Ürün başarıyla silindi");
          // Ürünleri yeniden yükle
          fetchProducts();
        } else {
          toast.error(response.data.message || "Ürün silinirken bir hata oluştu");
        }
      } catch (error) {
        console.error("Ürün silme hatası:", error);
        toast.error(error.response?.data?.message || "Ürün silinirken bir hata oluştu");
      }
    }
  };

  // Eğer ürün yüklenirken hata olursa hata mesajını göster
  if (isEditMode && error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <FaExclamationTriangle size={24} />
            <h2 className="text-xl font-semibold">Ürün Yüklenirken Hata Oluştu</h2>
          </div>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Ürünlere Dön
          </button>
        </div>
      </div>
    );
  }

  // Ürün yükleniyorsa loading spinner göster
  if (isEditMode && loadingProduct) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-8'>
      {/* Ürün Ekleme/Düzenleme Formu */}
      <div className='bg-white p-6 rounded-lg shadow-sm'>
        <h2 className='text-xl font-semibold mb-4'>
          {isEditMode ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
        </h2>
        <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
            <div>
              <p className='mb-2'>Resim Yükle</p>

              <div className='flex gap-2'>
                <label htmlFor="image1">
                  <img 
                    className='w-20 h-20 object-cover' 
                    src={!image1 
                      ? assets.upload_area 
                      : (image1.isExisting ? image1.preview : URL.createObjectURL(image1))
                    } 
                    alt="Ürün Resmi" 
                  />
                  <input 
                    onChange={(e) => setImage1(e.target.files[0])} 
                    type="file" 
                    id="image1" 
                    accept="image/*"
                    hidden
                  />
                </label>
                <label htmlFor="image2">
                  <img 
                    className='w-20 h-20 object-cover' 
                    src={!image2 
                      ? assets.upload_area 
                      : (image2.isExisting ? image2.preview : URL.createObjectURL(image2))
                    } 
                    alt="" 
                  />
                  <input 
                    onChange={(e) => setImage2(e.target.files[0])} 
                    type="file" 
                    id="image2" 
                    hidden
                  />
                </label>
                <label htmlFor="image3">
                  <img 
                    className='w-20 h-20 object-cover' 
                    src={!image3 
                      ? assets.upload_area 
                      : (image3.isExisting ? image3.preview : URL.createObjectURL(image3))
                    } 
                    alt="" 
                  />
                  <input 
                    onChange={(e) => setImage3(e.target.files[0])} 
                    type="file" 
                    id="image3" 
                    hidden
                  />
                </label>
                <label htmlFor="image4">
                  <img 
                    className='w-20 h-20 object-cover' 
                    src={!image4 
                      ? assets.upload_area 
                      : (image4.isExisting ? image4.preview : URL.createObjectURL(image4))
                    } 
                    alt="" 
                  />
                  <input 
                    onChange={(e) => setImage4(e.target.files[0])} 
                    type="file" 
                    id="image4" 
                    hidden
                  />
                </label>
              </div>
            </div>

            <div className='w-full'>
              <p className='mb-2'>Ürün İsmi</p>
              <input onChange={(e)=>setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2 border rounded' type="text" placeholder='Buraya Yazın' required/>
            </div>

            <div className='w-full'>
              <p className='mb-2'>Ürün Açıklaması</p>
              <textarea onChange={(e)=>setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2 border rounded min-h-[100px]' type="text" placeholder='Buraya Yazın' required/>
            </div>

            <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
                <div>
                  <p className='mb-2'>Ürün Kategorisi</p>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className='w-full px-3 py-2 border rounded'>
                      <option value="bambu">Bambu</option>
                      <option value="bıçak">Bıçak</option>
                      <option value="cam">Cam</option>
                      <option value="mutfak">Mutfak Eşyaları</option>
                  </select>
                </div>

                <div>
                  <p className='mb-2'>Alt Kategori</p>
                  <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} className='w-full px-3 py-2 border rounded'>
                    <option value="Topwear">Topwear</option>
                    <option value="Bottomwear">Bottomwear</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <p className='mb-2'>Ürün Fiyatı</p>
                  <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full px-3 py-2 border rounded sm:w-[120px]' type="number" placeholder='25' />
                </div>

            </div>

            <div className='flex gap-2 mt-2'>
              <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id='bestseller' />
              <label className='cursor-pointer' htmlFor="bestseller">En Çok Satılanlara Yükle</label>
            </div>

            <div className='flex gap-2 mt-4'>
              <button 
                type="submit" 
                className='px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition-colors'
              >
                {isEditMode ? 'Güncelle' : 'Yükle'}
              </button>
              
              {isEditMode && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditMode(false);
                    setName('');
                    setDescription('');
                    setImage1(false);
                    setImage2(false);
                    setImage3(false);
                    setImage4(false);
                    setPrice('');
                    setCategory("bambu");
                    setSubCategory("Topwear");
                    setBestseller(false);
                    setSizes([]);
                    navigate('/products');
                  }}
                  className='px-6 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors'
                >
                  İptal
                </button>
              )}
            </div>
        </form>
      </div>
      
      {/* Ürün Listesi */}
      <div className='bg-white p-6 rounded-lg shadow-sm'>
        <div className="flex justify-between items-center mb-4">
          <h2 className='text-xl font-semibold'>Ürün Listesi</h2>
          <button 
            onClick={fetchProducts} 
            className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
            disabled={loading}
          >
            <FaSync className={`${loading ? 'animate-spin' : ''}`} size={14} />
            <span className="text-sm">Yenile</span>
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : products.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {products.map((product) => (
              <div key={product._id} className='border rounded-lg p-4 hover:shadow-md transition-shadow'>
                <div className='aspect-video mb-4'>
                  <img 
                    src={product.images?.[0] || product.image?.[0] || 'https://via.placeholder.com/300x200'} 
                    alt={product.name}
                    className='w-full h-full object-cover rounded'
                  />
                </div>
                <h3 className='font-semibold mb-2'>{product.name}</h3>
                <p className='text-sm text-gray-600 mb-2'>{product.description}</p>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-gray-500'>{product.price} TL</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => navigate(`/add?edit=${product._id}`)}
                      className='text-blue-500 hover:text-blue-700'
                    >
                      <FaEdit />
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product._id)}
                      className='text-red-500 hover:text-red-700'
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center py-6 bg-gray-50 rounded-xl'>
            <p className='text-gray-600'>Henüz hiç ürün bulunmamaktadır.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Add