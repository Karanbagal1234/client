import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { notification } from "../utils/feedback";
import Loader from "../components/Loader";
import { StoreService } from "../services/store.js";
import { cartService } from "../services/cart.js";
import useRedirect from "../services/AuthChecker.js";
import { useCart } from "../context/cartContext.jsx";

const StorePage = () => {
  const { cartId } = useCart();
  const { redirectTo } = useRedirect();
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false); // For button states

  // Function to fetch store details and products
  const fetchStoreDetails = async () => {
    setLoading(true);
    try {
      const { getStoreDetails } = StoreService;
      const { getProductDetails } = cartService;
      
      const [storeResponse, productResponse] = await Promise.all([
        getStoreDetails(storeId),
        getProductDetails({ cartId })
      ]);
      
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
  }, [storeId]);

  const handleIncreaseQuantity = async (productId) => {
    try {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId
            ? { ...product, Quantity: product.Quantity + 1 }
            : product
        )
      );
      await cartService.addToCart({ productId, quantity: 1 });
    } catch (err) {
      notification.error("Failed to update quantity.");
    }
  };

  const handleDecreaseQuantity = async (productId) => {
    try {
      const updatedProducts = products.map((product) => {
        if (product._id === productId) {
          return product.Quantity > 1
            ? { ...product, Quantity: product.Quantity - 1 }
            : { ...product, Quantity: 0 }; // Set to 0 before removal
        }
        return product;
      });
  
      setProducts(updatedProducts);
      await cartService.addToCart({ productId, quantity: -1 });
    } catch (err) {
      notification.error("Failed to update quantity.");
    }
  };
  

  const handleRemoveProduct = async (productId) => {
    try {
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId)
      );

      await cartService.removeFromCart(productId);
      notification.success("Product removed from cart.");
      fetchStoreDetails(); // Refresh store details after removing
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
      navigate("/recipt"); // Redirect to receipt page
    } catch (err) {
      notification.error("Checkout failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <h2 className="text-2xl font-bold text-red-600">Error</h2>
        <p className="text-gray-700">{error}</p>
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
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader message="Loading store details..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 dark:bg-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {store?.StoreName}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">{store?.StoreAddress}</p>
        <p className="text-gray-600 dark:text-gray-300">
          Operating Hours: {store?.OperatingHours}
        </p>
      </div>

      <div className="max-w-4xl mx-auto mt-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-transform transform hover:-translate-y-1"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {product.Name}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                ${product.Price}
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Quantity: {product.Quantity}
              </p>
              <div className="flex justify-between">
                <button
                  onClick={() => handleDecreaseQuantity(product._id)}
                  className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
                >
                  -
                </button>
                <button
                  onClick={() => handleIncreaseQuantity(product._id)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                  +
                </button>
                <button
                  onClick={() => handleRemoveProduct(product._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-6 right-6 flex gap-4">
        <button
          onClick={handleScanProduct}
          className="px-6 py-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all"
        >
          Scan Product
        </button>
        <button
          onClick={handleCheckout}
          className={`px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg transition-all ${
            isProcessing ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Checkout"}
        </button>
      </div>
    </div>
  );
};

export default StorePage;
