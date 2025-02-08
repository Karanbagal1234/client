import React, { useState, useEffect } from "react";
import {
  FaStore,
  FaQrcode,
  FaBox,
  FaBell,
  FaClipboardList,
  FaCheck,
  FaTimes,
  FaPlus,
  FaUserEdit,
  FaEdit,
} from "react-icons/fa";
import Modal from "../components/Model";
import { authService } from "../services/auth";
import { retailService } from "../services/Retail";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const RetailerDashboard = () => {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedQrCode, setSelectedQrCode] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showUpdateProfileModal, setShowUpdateProfileModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productQuantity, setProductQuantity] = useState(0);
  const [products, setProducts] = useState([]);
  const [profileData, setProfileData] = useState({
    Name: "",
    PhoneNumber: "",
    Address: "",
  });

  const { createProduct, getProducts, updateProduct } = retailService;

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await authService.getProfile(true);
        setStore(response.data.store);
        setProfileData({
          Name: response.data.store.name,
          PhoneNumber: response.data.store.phoneNumber,
          Address: response.data.store.address,
        });
      } catch (error) {
        console.error("Error fetching store data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data);
        console
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchStoreData();
    fetchProducts();
  }, []);

  const handleViewQrCode = (product) => {
    setSelectedQrCode(product.QRCode);
    setShowQrModal(true);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">{store?.name || "Retailer Store"}</h1>
        <button
          onClick={() => setShowUpdateProfileModal(true)}
          className="bg-green-600 px-4 py-2 rounded-lg text-white hover:bg-green-700 mt-4 md:mt-0"
        >
          <FaUserEdit className="inline mr-2" /> Update Profile
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product._id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-2">{product.Name}</h3>
            <p className="text-gray-400 mb-2">${product.Price}</p>
            <p className="text-gray-400 mb-4">Stock: {product.Quantity}</p>
            <button
              onClick={() => handleViewQrCode(product)}
              className="bg-blue-600 w-full px-4 py-2 rounded-lg text-white hover:bg-blue-700"
            >
              <FaQrcode className="inline mr-2" /> View QR
            </button>
          </div>
        ))}
      </div>

      {showQrModal && (
        <Modal isOpen={showQrModal} onClose={() => setShowQrModal(false)} title="QR Code">
          {selectedQrCode ? (
            <img src={selectedQrCode} alt="QR Code" className="mx-auto w-full max-w-xs" />
          ) : (
            <p className="text-center">No QR Code available</p>
          )}
        </Modal>
      )}
    </div>
  );
};

export default RetailerDashboard;