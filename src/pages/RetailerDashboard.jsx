import React, { useState, useEffect } from "react";
import { FaQrcode, FaUserEdit, FaPlus, FaBell } from "react-icons/fa";
import { motion } from "framer-motion";
import Modal from "../components/Model";
import { authService } from "../services/auth";
import { retailService } from "../services/Retail";

const RetailerDashboard = () => {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedQrCode, setSelectedQrCode] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showStoreQrModal, setShowStoreQrModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showUpdateProfileModal, setShowUpdateProfileModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [profileData, setProfileData] = useState({
    Name: "",
    PhoneNumber: "",
    Address: "",
  });
  const [productData, setProductData] = useState({
    Name: "",
    Price: "",
    Quantity: 0,
    Location: "",
    Tax: 0,
  });

  const { createProduct, getProducts, removeProduct } = retailService;

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const { data } = await authService.getProfile(true);
        setStore(data.retailer.store);
        console.log("--------------------------------------------------")

        console.log(data.retailer.store)
        setProfileData({
          Name: data.retailer.Store.StoreName,
          PhoneNumber: data.retailer.Store.PhoneNumber,
          Address: data.retailer.Store.StoreAddress,
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
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchNotifications = async () => {
      try {
        // Fetch notifications from the server
        const response = await authService.getNotifications();
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchStoreData();
    fetchProducts();
    fetchNotifications();
  }, []);

  const handleAddProduct = async () => {
    try {
      const response = await createProduct(productData);
      setProducts([...products, response.data]);
      setShowAddProductModal(false);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleRemoveProduct = async (productId) => {
    try {
      await removeProduct({ id: productId });
      setProducts(
        products.filter((product) => product.ProductID !== productId)
      );
    } catch (error) {
      console.error("Error removing product:", error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await authService.updateProfile(profileData);
      setShowUpdateProfileModal(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleViewQrCode = (product) => {
    setSelectedQrCode(product.QRCode);
    setShowQrModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-purple-600">
          Welcome, {profileData.Name}
        </h1>
        <div className="flex gap-2 md:gap-4 mt-4 md:mt-0">
          <button
            onClick={() => setShowStoreQrModal(true)}
            className="bg-teal-600 px-5 md:px-5 py-2 md:py-2 rounded-lg text-white hover:bg-teal-700 transition-all text-sm md:text-base"
          >
            <FaQrcode className="inline mr-1 md:mr-2" />
            <span className="hidden sm:inline">Store QR</span>
          </button>
          <button
            onClick={() => setShowUpdateProfileModal(true)}
            className="bg-green-600 px-5 md:px-5 py-2 md:py-2 rounded-lg text-white hover:bg-green-700 transition-all text-sm md:text-base"
          >
            <FaUserEdit className="inline mr-1 md:mr-2" />
            <span className="hidden sm:inline">Update Profile</span>
          </button>
          <button className="bg-amber-500 px-5 md:px-5 py-2 md:py-2 rounded-lg text-white hover:bg-amber-600 transition-all text-sm md:text-base relative">
            <FaBell className="inline mr-1 md:mr-2" />
            <span className="hidden sm:inline">Notifications</span>
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                {notifications.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <motion.div
        className="bg-white p-6 rounded-lg shadow-lg mb-6 backdrop-filter backdrop-blur-lg bg-opacity-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-bold mb-4">Profile Details</h2>
        <p>
          <strong>Store Name:</strong> {profileData.Name}
        </p>
        <p>
          <strong>Phone Number:</strong> {profileData.PhoneNumber}
        </p>
        <p>
          <strong>Address:</strong> {profileData.Address}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {products.map((product, i) => (
        <motion.div
          key={i}
          className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-200"
          whileHover={{ scale: 1.05 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-2">{product.Name}</h3>
          <p className="text-gray-700 text-lg">Price: <span className="font-semibold">₹{product.Price}</span></p>
          <p className="text-gray-700 text-lg">Stock: <span className="font-semibold">{product.Quantity}</span></p>
          <p className="text-gray-700 text-lg">Tax: <span className="font-semibold">{product.Tax}%</span></p>
          <div className="mt-4 flex flex-col gap-2">
            <button
              onClick={() => handleViewQrCode(product)}
              className="bg-purple-600 w-full px-5 py-2.5 rounded-xl text-white font-medium hover:bg-purple-700 transition-all flex items-center justify-center"
            >
              <FaQrcode className="mr-2" /> View QR
            </button>
            <button
              onClick={() => handleRemoveProduct(product.ProductID)}
              className="bg-red-600 w-full px-5 py-2.5 rounded-xl text-white font-medium hover:bg-red-700 transition-all"
            >
              Remove
            </button>
          </div>
        </motion.div>
      ))}
    </div>

      <button
        onClick={() => setShowAddProductModal(true)}
        className="fixed bottom-6 right-6 bg-purple-600 p-4 rounded-full text-white hover:bg-purple-700 transition-all"
      >
        <FaPlus />
      </button>

      {showQrModal && (
        <Modal
          isOpen={showQrModal}
          onClose={() => setShowQrModal(false)}
          title="QR Code"
        >
          {selectedQrCode ? (
            <img
              src={selectedQrCode}
              alt="QR Code"
              className="mx-auto w-full max-w-xs"
            />
          ) : (
            <p className="text-center">No QR Code available</p>
          )}
        </Modal>
      )}

      {showStoreQrModal && (
        <Modal
          isOpen={showStoreQrModal}
          onClose={() => setShowStoreQrModal(false)}
          title="Store QR Code"
        >
          {store?.QRCode ? (
            <img
              src={store.QRCode}
              alt="Store QR Code"
              className="mx-auto w-full max-w-xs"
            />
          ) : (
            <p className="text-center">No Store QR Code available</p>
          )}
        </Modal>
      )}

      {showUpdateProfileModal && (
        <Modal
          isOpen={showUpdateProfileModal}
          onClose={() => setShowUpdateProfileModal(false)}
          title="Update Profile"
        >
          <input
            type="text"
            placeholder="Name"
            value={profileData.Name}
            onChange={(e) =>
              setProfileData({ ...profileData, Name: e.target.value })
            }
            className="w-full p-2 mb-4 rounded-lg border border-gray-300"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={profileData.PhoneNumber}
            onChange={(e) =>
              setProfileData({ ...profileData, PhoneNumber: e.target.value })
            }
            className="w-full p-2 mb-4 rounded-lg border border-gray-300"
          />
          <input
            type="text"
            placeholder="Address"
            value={profileData.Address}
            onChange={(e) =>
              setProfileData({ ...profileData, Address: e.target.value })
            }
            className="w-full p-2 mb-4 rounded-lg border border-gray-300"
          />
          <button
            onClick={handleUpdateProfile}
            className="bg-purple-600 px-4 py-2 text-white rounded-lg hover:bg-purple-700 transition-all"
          >
            Update
          </button>
        </Modal>
      )}

      {showAddProductModal && (
        <Modal
          isOpen={showAddProductModal}
          onClose={() => setShowAddProductModal(false)}
          title="Add Product"
        >
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-lg shadow-lg">
            <div className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  value={productData.Name}
                  onChange={(e) =>
                    setProductData({ ...productData, Name: e.target.value })
                  }
                  className="w-full p-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none bg-white"
                  required
                />
              </div>

              {/* Product Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  placeholder="Enter price"
                  value={productData.Price}
                  onChange={(e) =>
                    setProductData({ ...productData, Price: e.target.value })
                  }
                  className="w-full p-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none bg-white"
                  required
                />
              </div>

              {/* Product Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  placeholder="Enter quantity"
                  value={productData.Quantity}
                  min={0}
                  onChange={(e) =>
                    setProductData({ ...productData, Quantity: e.target.value })
                  }
                  className="w-full p-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none bg-white"
                  required
                />
              </div>

              {/* Product Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Location
                </label>
                <input
                  type="text"
                  placeholder="Enter product location"
                  value={productData.Location}
                  onChange={(e) =>
                    setProductData({ ...productData, Location: e.target.value })
                  }
                  className="w-full p-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tax
                </label>
                <input
                  type="Number"
                  placeholder="Enter Gst %"
                  value={productData.Tax}
                  min={0}
                  onChange={(e) =>
                    setProductData({ ...productData, Tax: e.target.value })
                  }
                  className="w-full p-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none bg-white"
                  required
                />
              </div>

              {/* Add Button */}
              <button
                onClick={handleAddProduct}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 rounded-lg text-white hover:from-purple-700 hover:to-indigo-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all"
              >
                Add Product
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default RetailerDashboard;
