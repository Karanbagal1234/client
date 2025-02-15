import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { notification } from "../utils/feedback";
import Loader from "../components/Loader";
import { StoreService } from "../services/store.js";
import { cartService } from "../services/cart.js";
import useRedirect from "../services/AuthChecker.js";
import { useCart } from "../context/cart.jsx";
import ChatBot from "../components/chatbot.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { motion } from "framer-motion";
import { ShoppingCart, Scan, MessageCircle } from "lucide-react";

const StorePage = () => {
  const { cartId, cart, setCart } = useCart();
  const { redirectTo } = useRedirect();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTotalExceeded, setIsTotalExceeded] = useState(false); // Track if total exceeds limit
  const storeId = localStorage.getItem("store");
  const { toggleChatBot, spendingLimit } = useAuth(); // Access spending limit and setLimit

  const fetchStoreDetails = async () => {
    if (!storeId) {
      notification.error("No store session found.");
      navigate("/");
      return;
    }
    setLoading(true);
    try {
      const storeResponse = await StoreService.getStoreDetails(storeId);
      const productResponse = await cartService.getProductDetails({ cartId });
      setStore(storeResponse.data.store);
      setProducts(productResponse.data);
    } catch (err) {
      setError("Failed to load store details.");
      notification.error("Failed to load store details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreDetails();
  }, [cartId, storeId]); // Added cartId and storeId as dependencies

  const handleIncreaseQuantity = async (productId) => {
    try {
      const { data } = await cartService.addToCart({ productId, quantity: 1 });

      setCart((prevCart) => ({
        ...prevCart,
        items: data.cart.items, // Directly update with API response
      }));
    } catch (err) {
      notification.error("Failed to update quantity.");
    }
  };

  const handleDecreaseQuantity = async (productId) => {
    try {
      await cartService.addToCart({ productId, quantity: -1 });
      console.log(cart);
      setCart((prevCart) =>
        prevCart.map((product) =>
          product._id === productId
            ? { ...product, Quantity: Math.max(0, product.Quantity - 1) }
            : product
        )
      );
    } catch (err) {
      notification.error("Failed to update quantity.");
    }
  };

  const handleRemoveProduct = async (productId) => {
    try {
      await cartService.removeFromCart(productId);
      setCart((prevCart) =>
        prevCart.filter((product) => product._id !== productId)
      );
      notification.success("Product removed from cart.");
    } catch (err) {
      notification.error("Failed to remove product.");
    }
  };

  const handleScanProduct = () => {
    redirectTo("/scan");
    notification.info("Scanning product...");
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      notification.success("Checkout successful!");
      navigate("/recipt");
    } catch (err) {
      notification.error("Checkout failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateTotal = () => {
    if (!Array.isArray(products) || products.length === 0) {
      return { subtotal: 0, gst: 0, total: 0 };
    }

    const subtotal = products.reduce(
      (acc, product) => acc + (product.Price || 0) * (product.Quantity || 0),
      0
    );

    const totalTax = products.reduce(
      (acc, product) =>
        acc +
        (product.Price || 0) *
          (product.Quantity || 0) *
          ((product.Tax || 0) / 100),
      0
    );

    const total = subtotal + totalTax;

    return {
      subtotal: Number(subtotal.toFixed(2)),
      gst: Number(totalTax.toFixed(2)),
      total: Number(total.toFixed(2)),
    };
  };

  const { subtotal, gst, total } = calculateTotal();

  // Alert when total exceeds or is close to the spending limit
  useEffect(() => {
    if (spendingLimit) {
      if (total > spendingLimit && !isTotalExceeded) {
        notification.warning(
          `You have exceeded your spending limit of  ₹${spendingLimit}. Please review your cart.`
        );
        setIsTotalExceeded(true);
      } else if (total <= spendingLimit && isTotalExceeded) {
        setIsTotalExceeded(false);
      }

      // Friendly message when close to the limit
      if (total >= spendingLimit * 0.9 && total < spendingLimit) {
        notification.info(
          `You're close to your spending limit of  ₹${spendingLimit}. Keep an eye on your cart!`
        );
      }
    }
  }, [total, spendingLimit, isTotalExceeded]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 dark:bg-gray-900">
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
          Error
        </h2>
        <p className="text-gray-700 dark:text-gray-300">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Loader message="Loading store details..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/80 backdrop-blur-sm p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white/20 backdrop-blur-lg rounded-xl shadow-lg p-6"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {store?.StoreName}
            </h1>
            <p className="text-sm text-gray-600 mt-1">{store?.StoreAddress}</p>
          </div>
          <div className="mt-3 sm:mt-0 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md">
            <p className="text-sm">Operating Hours: {store?.OperatingHours}</p>
          </div>
        </div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 border-b-2 border-purple-500 pb-2">
            Available Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => {
              const totalAmount = (
                product.Price *
                product.Quantity *
                (1 + product.Tax / 100)
              ).toFixed(2);
              return (
                <motion.div
                  key={product._id}
                  whileHover={{ scale: 1.03 }}
                  className="bg-gradient-to-br from-white/40 to-gray-100/50 backdrop-blur-lg rounded-xl p-5 shadow-xl border border-gray-300"
                >
                  <h3 className="text-xl font-semibold text-gray-900">
                    {product.Name}
                  </h3>

                  <div className="my-4 space-y-2">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Price:</span> ₹
                      {product.Price}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Quantity:</span>{" "}
                      {product.Quantity}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Tax:</span> {product.Tax}%
                    </p>
                    <p className="text-base font-semibold text-gray-900">
                      <span className="text-gray-800">Total:</span> ₹
                      {totalAmount}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleDecreaseQuantity(product._id)}
                        className="px-3 py-1.5 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
                      >
                        -
                      </button>
                      <span className="text-lg font-medium">
                        {product.Quantity}
                      </span>
                      <button
                        onClick={() => handleIncreaseQuantity(product._id)}
                        className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveProduct(product._id)}
                    className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all shadow-md"
                  >
                    Remove
                  </button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Pricing Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 bg-white/20 backdrop-blur-lg rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Payment Summary
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal:</span>
              <span className="text-gray-900"> ₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>GST (7%):</span>
              <span className="text-gray-900"> ₹{gst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-900 font-bold border-t pt-3">
              <span>Total:</span>
              <span> ₹{total.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div
          className=" bottom-4 right-4 flex item-center items-center justify-center gap-3 flex-col mt-5 md:items-end"
          style={{ right: "-156px" }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-3 py-2 bg-purple-600 text-white rounded-full shadow-lg flex items-center justify-between w-[168px] gap-4 mt-2"
            onClick={handleScanProduct}
          >
            <Scan className="mr-2" />
            Scan Product
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-3 py-2 bg-blue-600 text-white rounded-full shadow-lg flex items-center w-[168px] gap-4 mt-2"
            onClick={handleCheckout}
          >
            <ShoppingCart className="mr-2" />
            Checkout
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-3 py-2  text-white rounded-full shadow-lg flex items-center justify-center  bg-teal-600 hover:bg-teal-700   w-[168px] gap-4 mt-2"
            onClick={toggleChatBot}
          >
            <MessageCircle className="mr-2" />
            <span className="relative right-4">Chat</span>
          </motion.button>
        </div>
      </motion.div>

      <ChatBot />
    </div>
  );
};

export default StorePage;
