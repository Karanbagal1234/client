import { useNavigate } from "react-router-dom";
import QRScanner from "../components/QrScanner";
import { cartService } from "../services/cart";
import { notification } from "../utils/feedback";
import { useState } from "react";
import useRedirect from "../services/AuthChecker";
import { StoreService } from "../services/store";
import Modal from "../components/Model";
import { useAuth } from "../context/AuthContext"; // Import useAuth to access spending limit functionality
import { useCart } from "../context/cart";
const ScanPage = () => {
  const { setCartId, setStore, cart, cartId, setCart } = useCart();
  const { redirectTo } = useRedirect();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { setLimit } = useAuth(); // Access setLimit from AuthContext

  const handleScanSuccess = async (data) => {
    try {
      if (!data?.type) {
        notification.error("Invalid QR code.");
        return;
      }

      if (data.type.toLowerCase() === "store") {
        // ✅ Handling store QR codes
        const res = await StoreService.startStoreSession({
          storeId: "67a8922ebe086261dfe7f9a9",
        });
        if (res?.data?.session?.cartId) {
          localStorage.setItem("store", data.ID);
          localStorage.setItem("cart", res.data.session.cartId);

          setCartId(res.data.session.cartId);
          setStore(data.ID);

          // Prompt user to set a spending limit
          const limitInput = prompt(
            "Set your spending limit for this store (or leave blank for default $1000):"
          );
          const limit = limitInput ? parseFloat(limitInput) : 1000; // Default to $1000 if no input
          if (!isNaN(limit)) {
            setLimit(limit); // Set the spending limit in AuthContext
            notification.success(`Spending limit set to $${limit}.`);
          } else {
            notification.error("Invalid input. Defaulting to $1000.");
            setLimit(1000); // Set default limit
          }

          redirectTo("/Shopping-start");
        } else {
          notification.error("Failed to start store session.");
        }
      } else if (data.type.toLowerCase() === "product") {
        // ✅ Handling product QR codes
        const res = await cartService.ScanProduct({
          cartId,
          productId: data.ID,
        });
        if (res?.data?.product) {
          setSelectedProduct({ ...res.data.product, quantity: 1 });
          setIsModalOpen(true);
          notification.success("Product scanned successfully!");
        } else {
          notification.error("Product not found.");
        }
      } else {
        notification.error("Unsupported QR code format.");
      }
    } catch (error) {
      console.error("QR Scan Error:", error);
      notification.error("Something went wrong while scanning.");
    }
  };

  const handleAddToCart = async (quantity) => {
    if (!selectedProduct?._id) return;

    try {
      const a = await cartService.addToCart({
        productId: selectedProduct._id,
        quantity,
      });

      // ✅ Update cart state immediately
      setCart((prevCart) => {
        const existingProduct = prevCart.find(
          (p) => p._id === selectedProduct._id
        );
        if (existingProduct) {
          return prevCart.map((p) =>
            p._id === selectedProduct._id
              ? { ...p, Quantity: p.Quantity + quantity }
              : p
          );
        } else {
          return [...prevCart, { ...selectedProduct, Quantity: quantity }];
        }
      });

      setIsModalOpen(false);
      notification.success("Product added to cart successfully!");
      redirectTo("/Shopping-start");
    } catch (error) {
      console.error("Error adding to cart:", error);
      notification.error("Failed to add product to cart.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold">Scan QR Code</h1>
      <p>
        Position a store or product QR code within the frame to scan.
        67aee7250445301d3f4aecb2
      </p>

      <QRScanner onScanSuccess={handleScanSuccess} />

      {/* Test Buttons */}
      <button
        onClick={() => {
          const data = prompt("Enter the Store ID");
          handleScanSuccess({ type: "store", ID: data });
        }}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Simulate Store Scan
      </button>
      <button
        onClick={() => {
          const data = prompt("Enter the Product ID");
          handleScanSuccess({ type: "product", ID: data });
        }}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg"
      >
        Simulate Product Scan
      </button>

      {/* Confirmation Modal for Adding Product */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirm Purchase"
      >
        {selectedProduct && (
          <div className="flex flex-col space-y-4">
            <p className="text-lg font-semibold">
              Name: {selectedProduct.Name}
            </p>
            <p className="text-gray-600">Price: ${selectedProduct.Price}</p>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <button
                className="bg-gray-600 text-white px-3 py-1 rounded-lg hover:bg-gray-700"
                onClick={() =>
                  setSelectedProduct((prev) => ({
                    ...prev,
                    quantity: Math.max(1, prev.quantity - 1),
                  }))
                }
              >
                -
              </button>
              <span className="text-lg">{selectedProduct.quantity}</span>
              <button
                className="bg-gray-600 text-white px-3 py-1 rounded-lg hover:bg-gray-700"
                onClick={() =>
                  setSelectedProduct((prev) => ({
                    ...prev,
                    quantity: prev.quantity + 1,
                  }))
                }
              >
                +
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={() => handleAddToCart(selectedProduct.quantity)}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white"
            >
              Add to Cart
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ScanPage;
