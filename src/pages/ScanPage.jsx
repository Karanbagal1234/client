import {
  Navigate,
  useLocation,
  useNavigate,
  useNavigationType,
} from "react-router-dom";
import QRScanner from "../components/QrScanner";
import { cartService } from "../services/cart";
import { notification } from "../utils/feedback";
import { useAuth } from "../context/AuthContext";
import { StoreService } from "../services/store";
import { useCart } from "../context/cartContext";
import { useState } from "react";
import Modal from "../components/Model";
import useRedirect from "../services/AuthChecker";
const ScanPage = () => {
  const {redirectTo} = useRedirect();
  const { cartId,setcartId }= useCart();
  const navigate = useNavigate();
  const { startStoreSession } = StoreService;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
let res;
  const handleScanSuccess = async (data) => {
    console.log("Scanned Data:", data);

    switch (data?.type?.toLowerCase()) {
      case "product":
        res = await cartService.ScanProduct({ productId: data.ID });
        setSelectedProduct(res.data.product);
        setIsModalOpen(true);
        notification.success(`Product added to cart successfully!`);


        break;
        case "store":
          localStorage.setItem("store", data.ID);
          res = await startStoreSession({ storeId: data.ID });
          
          setcartId(res.data.session.cartId);  // Update state
          localStorage.setItem("cartId", cartId);  // Store updated value
        
          navigate(`/Shopping-start/${data.ID}`);
          console.log("cartId :" + res.data.session.cartId);
          break;
        
      default:
        notification.error("Unsupported QR code format.");
    }
  };
const handleAddToCart = async (quantity) => {
  const serData = {productId : selectedProduct._id, quantity};
  await  cartService.addToCart(serData);
  setIsModalOpen(false);
  notification.success(`Product added to cart successfully!`);
  redirectTo(`/Shopping-start/${localStorage.getItem("store")}`);
  
};
  const handleScanError = (error) => {
    console.error("QR Scan Error:", error);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900 p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Scan QR Code</h1>
        <p className="text-gray-600">
          Position a store or product QR code within the frame to scan.
        </p>
      </div>

      {/* QR Scanner */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <QRScanner
          onScanSuccess={handleScanSuccess}
          onScanFailure={handleScanError}
          qrbox={{ width: 250, height: 250 }}
          className="w-full h-64 rounded-lg overflow-hidden"
          scanLabel="Align QR code in the frame"
        />
      </div>

      {/* Help Text */}
      <p className="mt-6 text-sm text-gray-500 text-center">
        Having trouble scanning? Ensure the QR code is well-lit and centered.
      </p>
      <button
        onClick={() =>
          handleScanSuccess({ type: "store", ID: "67a4f77219479b12efd16e10" })
        }
        className="mt-4 w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        store scan
      </button>
      <button
        onClick={() => {
          const data = prompt("Enter the product ID");
          handleScanSuccess({ type: "product", ID: data });
        }}
        className="mt-4 w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        product scan
      </button>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirm Purchase"
      >
        {selectedProduct && (
          <div className="flex flex-col space-y-4">
            <p className="text-lg font-semibold">Name: {selectedProduct.Name}</p>
            <p className="text-gray-600">Price: ${selectedProduct.Price}</p>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <button
                className="bg-gray-600 text-white px-3 py-1 rounded-lg hover:bg-gray-700"
                onClick={() => setSelectedProduct((prev) => ({ ...prev, quantity: Math.max(1, (prev.quantity || 1) - 1) }))}
              >
                -
              </button>
              <span className="text-lg">{selectedProduct.quantity || 1}</span>
              <button
                className="bg-gray-600 text-white px-3 py-1 rounded-lg hover:bg-gray-700"
                onClick={() => setSelectedProduct((prev) => ({ ...prev, quantity: (prev.quantity || 1) + 1 }))}
              >
                +
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={() => handleAddToCart(selectedProduct.quantity || 1)}
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
