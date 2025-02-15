import { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/cart.js';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartId, setCartId] = useState(localStorage.getItem('cart') || null);
  const [store, setStore] = useState(localStorage.getItem('store') || null);
  const [cart, setCart] = useState([]); 
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) {
      setCart([]);
      return;
    }
    try {
      const { data } = await cartService.getPurchaseHistory();
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  useEffect(() => {
    setCartId(localStorage.getItem('cart'));
    setStore(localStorage.getItem('store'));
  }, []);

  return (
    <CartContext.Provider value={{ cartId, setCartId, store, setStore, cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
