import { createContext, createRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.BACKEND_URL;
axios.defaults.withCredentials = true;

export const AppContext = createContext(null);

const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(null);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState({});

  // check seller status
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      if (data.success) {
        setIsSeller(true);
      } else {
        setIsSeller(false);
      }
    } catch (error) {
      setIsSeller(false);
    }
  };

  // fetch user auth status ,user Data and cart items
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cart);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // fetch all products data
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/products/get");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error in fetchProducts AppContext", error);
      toast.error("Internal server error, please try later");
    }
  };

  // add items to cart
  const addToCart = (itemId) => {
    const cartData = structuredClone(cartItems || {});

    if (cartData[itemId]) {
      cartData[itemId] = cartData[itemId] + 1;
    } else {
      cartData[itemId] = 1;
    }

    setCartItems(cartData);
    toast.success("Item added to cart");
  };

  // update the cart item quantity
  const updateCartItemQuantity = (itemId, quantity) => {
    const cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success("cart updated");
  };

  // total cart items
  const totalCartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      totalCount = totalCount + cartItems[item];
    }
    return totalCount;
  };

  // total cart amount
  const totalCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (cartItems[items] > 0) {
        totalAmount = totalAmount + cartItems[items] * itemInfo.offerPrice;
      }
    }
    return Math.floor(totalAmount);
  };

  // remove item from cart
  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] = cartData[itemId] - 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
      toast.success("Item removed from cart");
      setCartItems(cartData);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    addToCart,
    updateCartItemQuantity,
    totalCartCount,
    totalCartAmount,
    removeFromCart,
    cartItems,
    searchQuery,
    setSearchQuery,
    axios,
    fetchProducts,
    fetchSeller,
    fetchUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
