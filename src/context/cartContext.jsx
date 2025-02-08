import { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/cart.js';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartId, setcartId] = useState('')
  const [cart, setCart] = useState([]); // Ensure cart is always an array
  const { user } = useAuth();

  const fetchCartHistory = async () => {
    console.log(user);
    
    if (user) {
      try {
        const {data}  = await cartService.getPurchaseHistory();
        console.log(data);
        setCart(data);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    } else {
      setCart([]);
    }
  };

  // useEffect(() => {
  //   fetchCartHistory();
  // }, [user]);

  const updateCart = async (productId, quantity) => {
    try {
      await cartService.updateCart({ productId, quantity });
      await fetchCart();
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await cartService.removeFromCart(productId);
      await fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  return (
    <CartContext.Provider value={{cartId,setcartId, cart, updateCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);