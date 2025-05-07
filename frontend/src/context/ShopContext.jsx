import { createContext, useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

export const ShopContext = createContext(null);

export const ShopContextProvider = (props) => {
    const currency = '₺';
    const delivery_fee = 10;
    const backendUrl = "http://localhost:4000";
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const navigate = useNavigate();
    const [totalAmount, setTotalAmount] = useState(0);

    const addToCart = async (itemId, size) => {
        const sizeToUse = size || "standart";
        
        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][sizeToUse]) {
                cartData[itemId][sizeToUse] += 1;
            }
            else {
                cartData[itemId][sizeToUse] = 1;
            }
        }
        else {
            cartData[itemId] = {};
            cartData[itemId][sizeToUse] = 1;
        }
        setCartItems(cartData);
        
        toast.success('Ürün sepete eklendi');

        if (token) {
            try {
                await axios.post(`${backendUrl}/api/cart/add`, { itemId, size: sizeToUse }, { headers: { token } })
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {

                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);

        cartData[itemId][size] = quantity;

        setCartItems(cartData)

        if (token) {
            try {
                await axios.post(`${backendUrl}/api/cart/update`, { itemId, size, quantity }, { headers: { token } })
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                } catch (error) {

                }
            }
        }
        return totalAmount;
    }

    const getProductsData = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/product/list`)
            if (response.data.success) {
                setProducts(response.data.products.reverse())
            } else {
                toast.error(response.data.message)
                setExampleProducts();
            }
        } catch (error) {
            console.log(error)
            toast.error("Ürünler yüklenirken bir hata oluştu")
            setExampleProducts();
        }
    }

    // Örnek ürünler oluştur
    const setExampleProducts = () => {
        const exampleProducts = [
            {
                _id: "example1",
                name: "Bambu Çatal Kaşık Seti",
                description: "Doğal bambu malzemeden üretilmiş çevre dostu çatal kaşık seti.",
                price: 150,
                image: ["https://picsum.photos/400/400?random=1"],
                category: "bambu",
                subCategory: "mutfak",
                sizes: ["standart"],
                date: Date.now(),
                bestseller: true
            },
            {
                _id: "example2",
                name: "Şef Bıçağı Set",
                description: "Profesyonel mutfaklar için özel üretim şef bıçağı seti.",
                price: 450,
                image: ["https://picsum.photos/400/400?random=2"],
                category: "bıçak",
                subCategory: "mutfak",
                sizes: ["standart"],
                date: Date.now(),
                bestseller: true
            },
            {
                _id: "example3",
                name: "Kristal Cam Bardak",
                description: "El yapımı kristal cam bardak seti.",
                price: 320,
                image: ["https://picsum.photos/400/400?random=3"],
                category: "cam",
                subCategory: "ev",
                sizes: ["standart"],
                date: Date.now(),
                bestseller: true
            },
            {
                _id: "example4",
                name: "Paslanmaz Çelik Tencere",
                description: "Yüksek kalite paslanmaz çelik tencere seti.",
                price: 780,
                image: ["https://picsum.photos/400/400?random=4"],
                category: "mutfak",
                subCategory: "ev",
                sizes: ["standart"],
                date: Date.now(),
                bestseller: true
            },
            {
                _id: "example5",
                name: "Bambu Salata Kasesi",
                description: "Doğal bambu salata kasesi.",
                price: 210,
                image: ["https://picsum.photos/400/400?random=5"],
                category: "bambu",
                subCategory: "mutfak",
                sizes: ["standart"],
                date: Date.now(),
                bestseller: false
            },
            {
                _id: "example6",
                name: "Ekmek Bıçağı",
                description: "Özel dişli ekmek bıçağı.",
                price: 180,
                image: ["https://picsum.photos/400/400?random=6"],
                category: "bıçak",
                subCategory: "mutfak",
                sizes: ["standart"],
                date: Date.now(),
                bestseller: false
            }
        ];
        
        setProducts(exampleProducts);
    }

    const getUserCart = async (token) => {
        try {
            const response = await axios.post(`${backendUrl}/api/cart/get`, {}, { headers: { token } })
            if (response.data.success) {
                setCartItems(response.data.cartData)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        getProductsData()
    }, [])

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'))
        }
        if (token) {
            getUserCart(token)
        }
    }, [token])

    const contextValue = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, setCartItems,
        getCartCount, updateQuantity,
        getCartAmount, navigate, backendUrl,
        setToken, token,
        totalAmount,
        setTotalAmount
    }

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export const useShop = () => {
    const context = useContext(ShopContext);
    if (!context) {
        throw new Error('useShop must be used within a ShopContextProvider');
    }
    return context;
};

export default ShopContextProvider;