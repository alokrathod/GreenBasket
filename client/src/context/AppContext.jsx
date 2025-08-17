import { createContext, createRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";

export const AppContext = createContext(null);

const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(null);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState({});

  // fetch all products data
  const fetchProducts = async () => {
    setProducts(dummyProducts);
  };

  // add items to cart
  const addToCart = (itemId) => {
    const cartData = structuredClone(cartItems);

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
    return Math.floor(totalAmount * 1000) / 100;
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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
