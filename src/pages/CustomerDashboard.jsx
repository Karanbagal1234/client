import React, { useState, useEffect } from "react";
import { FaQrcode, FaStore, FaGift, FaBell, FaUserEdit } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import useRedirect from "../services/AuthChecker";
import { cartService } from "../services/cart.js";
import Modal from "../components/Model.jsx";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { useCart } from "../context/cart.jsx";

const CustomerDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const { setCartId, setStore } = useCart();
  const [stores, setStores] = useState([
    { id: 1, name: "SuperMart", distance: "2.5 km", category: "Grocery" },
    { id: 2, name: "ElectroWorld", distance: "4 km", category: "Electronics" },
  ]);
  const [slideIndex, setSlideIndex] = useState(0);

  const handleSlide = (direction) => {
    if (direction === "next" && slideIndex < transactions.length - 1) {
      setSlideIndex(slideIndex + 1);
    } else if (direction === "prev" && slideIndex > 0) {
      setSlideIndex(slideIndex - 1);
    }
  };
  const { redirectTo } = useRedirect();
  const profilePic = user?.ProfilePic ? user.ProfilePic : "/public/default.png";

  const handleScanBtn = () => {
    redirectTo("/Scan");
  };

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      try {
        const { data } = await cartService.getPurchaseHistory();
        if (Array.isArray(data)) {
          setTransactions(data);
        } else {
          console.error("Expected an array, but received:", data);
          setTransactions([]);
        }
      } catch (error) {
        console.error("Error fetching purchase history:", error);
        setTransactions([]);
      }
    };

    fetchPurchaseHistory();
  }, []);

  const handleEditProfileClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const restartService = (cartId, storeId) => {
    localStorage.setItem("cart", cartId);
    localStorage.setItem("store", storeId);
    setCartId(cartId);
    setStore(storeId);
    redirectTo("/Shopping-start");
  };

  return (
    <div
      className="min-h-screen text-gray-800 p-6 relative overflow-hidden"
   
    >
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 relative z-10">
  {/* Heading */}
  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 md:mb-0">
    Welcome, {user?.Name}
  </h1>

  {/* Buttons Container */}
  <div className="flex flex-wrap gap-2 sm:gap-3 w-full md:w-auto justify-center md:justify-start">
    <button
      onClick={handleScanBtn}
      className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg flex items-center shadow-md hover:shadow-lg transition-shadow text-sm sm:text-base"
    >
      <FaQrcode className="mr-2" /> Scan Store QR
    </button>
    <button className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg flex items-center shadow-md hover:shadow-lg transition-shadow text-sm sm:text-base">
      <FaStore className="mr-2" /> Nearby Stores
    </button>
    <button className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg flex items-center shadow-md hover:shadow-lg transition-shadow text-sm sm:text-base">
      <FaGift className="mr-2" /> {user?.LoyaltyPoints} Points
    </button>
    <button
      onClick={handleEditProfileClick}
      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg flex items-center shadow-md hover:shadow-lg transition-shadow text-sm sm:text-base"
    >
      <FaUserEdit className="mr-2" /> Edit Profile
    </button>
  </div>
</div>

      {/* PROFILE SECTION */}
      <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4 md:p-6 shadow-lg mb-8 relative z-10">
  <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-4 md:space-y-0">
    <img
      src={profilePic}
      alt="Profile"
      className="w-16 h-16 rounded-full border-2 border-purple-500"
    />
    <div className="text-center md:text-left">
      <h2 className="text-xl font-semibold text-gray-900">
        {user?.Name}
      </h2>
      <p className="text-gray-600">{user?.Email}</p>
    </div>
  </div>
</div>

      {/* RECENT PURCHASES */}
      <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4 md:p-6 shadow-lg mb-8 relative z-10">
  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
    Recent Purchases 67a8922ebe086261dfe7f9a9
  </h2>
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="hidden md:table-header-group">
        <tr className="border-b border-gray-300">
          <th className="py-3 text-left text-gray-700">Date</th>
          <th className="py-3 text-left text-gray-700">Store</th>
          <th className="py-3 text-left text-gray-700">Amount</th>
          <th className="py-3 text-left text-gray-700">Items</th>
          <th className="py-3 text-left text-gray-700">Status</th>
          <th className="py-3 text-left text-gray-700">Action</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(transactions) && transactions.length > 0 ? (
          transactions.map((txn, i) => (
            <tr
              key={i}
              className="border-b border-gray-200 hover:bg-gray-50 transition-colors flex flex-col md:table-row"
            >
              <td className="py-2 md:py-3 text-gray-700">
                <span className="font-semibold md:hidden">Date: </span>
                {txn.Date}
              </td>
              <td className="py-2 md:py-3 text-gray-700">
                <span className="font-semibold md:hidden">Store: </span>
                {txn.Store}
              </td>
              <td className="py-2 md:py-3 text-gray-700">
                <span className="font-semibold md:hidden">Amount: </span>
                ₹{txn.Amount}
              </td>
              <td className="py-2 md:py-3 text-gray-700">
                <span className="font-semibold md:hidden">Items: </span>
                {txn.Items.length}
              </td>
              <td
                className={`py-2 md:py-3 ${
                  txn.Status === "Completed"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                <span className="font-semibold md:hidden">Status: </span>
                {txn.Status}
              </td>
              <td className="py-2 md:py-3">
                {txn.Status === "unpaid" && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      restartService(txn.cartId, txn.storeId)
                    }
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 md:px-3 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-shadow w-full md:w-auto"
                  >
                    <RefreshCw className="mr-1" /> Restart
                  </motion.button>
                )}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="text-center py-6 text-gray-600">
              No transactions found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>
      {/* NEARBY STORES */}
      <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6 shadow-lg mb-8 relative z-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Nearby Stores</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <div
              key={store.id}
              className="bg-white/30 backdrop-blur-lg border border-white/20 rounded-lg p-4 hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {store.name}
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                {store.distance} • {store.category}
              </p>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg w-full transition-colors">
                View Store
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* LOYALTY REWARDS */}
      <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6 shadow-lg mb-8 relative z-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Loyalty Rewards
        </h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="bg-purple-600 text-white p-6 rounded-lg flex-1 text-center shadow-lg">
            <p className="text-2xl font-bold">{user?.LoyaltyPoints} Points</p>
            <p className="text-sm">Current Balance</p>
          </div>
          <div className="bg-teal-600 text-white p-6 rounded-lg flex-1 text-center shadow-lg">
            <p className="text-2xl font-bold">50 More Points</p>
            <p className="text-sm">To Next Tier</p>
          </div>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6 shadow-lg relative z-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h2>
        <ul className="space-y-4">
          <li className="bg-white/30 backdrop-blur-lg p-4 rounded-lg flex items-center space-x-3 hover:bg-white/40 transition-colors">
            <FaBell className="text-purple-600" />
            <p className="text-gray-700">Order Confirmed: Tech Mart (₹ 120)</p>
          </li>
          <li className="bg-white/30 backdrop-blur-lg p-4 rounded-lg flex items-center space-x-3 hover:bg-white/40 transition-colors">
            <FaBell className="text-purple-600" />
            <p className="text-gray-700">New Reward Available!</p>
          </li>
        </ul>
      </div>

      {/* EDIT PROFILE MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title="Edit Profile"
      >
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            value={user?.Name}
            placeholder="Name"
            className="bg-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="text"
            value={user?.PhoneNumber}
            placeholder="Mobile Number"
            className="bg-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="email"
            value={user?.Address}
            placeholder="Address"
            className="bg-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={() => {
              alert("Profile updated!");
              handleModalClose();
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            Save Changes
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CustomerDashboard;
