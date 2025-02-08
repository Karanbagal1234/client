import React, { useState, useEffect } from "react";
import {
  FaQrcode,
  FaStore,
  FaGift,
  FaBell,
  FaMapMarkerAlt,
  FaCreditCard,
  FaShoppingBag,
  FaUserEdit,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import useRedirect from "../services/AuthChecker";
import { cartService } from "../services/cart.js"; // Make sure you import cartService correctly
import Modal from "../components/Model.jsx";
import { Navigate } from "react-router-dom";

const CustomerDashboard = () => {
 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState([]); // Initialize as an empty array
  const [stores, setStores] = useState([
    { id: 1, name: "SuperMart", distance: "2.5 km", category: "Grocery" },
    { id: 2, name: "ElectroWorld", distance: "4 km", category: "Electronics" },
  ]);

  const { redirectTo } = useRedirect();

  // Fallback for profile picture if not provided
  const profilePic = user?.ProfilePic ? user.ProfilePic : "/public/default.png";

  const handleScanBtn = () => {
    redirectTo("/Scan");
  };

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      try {
        console.log('come here');
        
        const response = await cartService.getPurchaseHistory();
        // Ensure the response is an array before setting state
        console.log('come here');

        if (Array.isArray(response)) {
          setTransactions(response);
        } else {
          console.error("Expected an array, but received:", response);
          setTransactions([]); // Fallback to an empty array if not an array
        }
      } catch (error) {
        console.error("Error fetching purchase history:", error);
        setTransactions([]); // Fallback to an empty array in case of error
      }
    };

    // fetchPurchaseHistory();
  }, []);
  const handleEditProfileClick = () => {
    setIsModalOpen(true); // Open modal when 'Edit Profile' button is clicked
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // Close modal
  };
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customer Dashboard</h1>
        <div className="flex space-x-4">
          <button
            onClick={handleScanBtn}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg flex items-center"
          >
            <FaQrcode className="mr-2" /> Scan Store QR
          </button>
          <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center">
            <FaStore className="mr-2" /> Nearby Stores
          </button>
          <button className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg flex items-center">
            <FaGift className="mr-2" /> {user?.LoyaltyPoints} Points
          </button>
        </div>
      </div>

      {/* PROFILE SECTION */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-md mb-6">
        <div className="flex items-center space-x-4">
          <img
            src={profilePic}
            alt="Profile"
            className="w-16 h-16 rounded-full border-2 border-gray-500"
          />
          <div>
            <h2 className="text-xl font-semibold">{user?.Name}</h2>
            <p className="text-gray-400">{user?.Email}</p>
          </div>
          <button onClick={handleEditProfileClick} className="ml-auto bg-blue-600 px-4 py-2 rounded-lg flex items-center">
            <FaUserEdit className="mr-2" /> Edit Profile
          </button>
        </div>
      </div>

      {/* RECENT PURCHASES */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Recent Purchases</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="py-2">Date</th>
              <th>Store</th>
              <th>Amount</th>
              <th>Items</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(transactions) && transactions.length > 0 ? (
              transactions.map((txn) => (
                <tr key={txn.id} className="border-b border-gray-700">
                  <td className="py-2">{txn.Date}</td>
                  <td>{txn.Store}</td>
                  <td>{txn.Amount}</td>
                  <td>{txn.Items}</td>
                  <td
                    className={`text-${
                      txn.Status === "Completed" ? "green" : "red"
                    }-400`}
                  >
                    {txn.Status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* NEARBY STORES */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Nearby Stores</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stores.map((store) => (
            <div
              key={store.id}
              className="bg-gray-700 p-4 rounded-lg flex items-center justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold">{store.name}</h3>
                <p className="text-gray-400">
                  {store.distance} • {store.category}
                </p>
              </div>
              <button className="bg-indigo-600 px-3 py-2 rounded-lg">
                View
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* LOYALTY PROGRAM */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Loyalty Rewards</h2>
        <div className="flex space-x-4">
          <div className="bg-yellow-600 p-4 rounded-lg flex-1 text-center">
            <p className="text-lg font-semibold">
              {user?.LoyaltyPoints} Points
            </p>
            <p className="text-sm text-gray-200">Current Balance</p>
          </div>
          <div className="bg-blue-600 p-4 rounded-lg flex-1 text-center">
            <p className="text-lg font-semibold">50 More Points</p>
            <p className="text-sm text-gray-200">To Next Tier</p>
          </div>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
        <ul className="space-y-2">
          <li className="bg-gray-700 p-3 rounded-lg flex items-center">
            <FaBell className="text-yellow-400 mr-2" /> Order Confirmed: Tech
            Mart ($120)
          </li>
          <li className="bg-gray-700 p-3 rounded-lg flex items-center">
            <FaBell className="text-yellow-400 mr-2" /> New Reward Available!
          </li>
        </ul>
      </div>
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
            className="bg-gray-700 p-2 rounded-lg"
          />
           <input
            type="text"
            value={user?.PhoneNumber}
            placeholder="Mobile Number"
            className="bg-gray-700 p-2 rounded-lg"
          />
          <input
            type="email"
            value={user?.Address}
            placeholder="Address"
            className="bg-gray-700 p-2 rounded-lg"
          />
          <button
            onClick={() => {
              // Handle profile update logic
              alert("Profile updated!");
              handleModalClose(); // Close modal after update
            }}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            Save Changes
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CustomerDashboard;
