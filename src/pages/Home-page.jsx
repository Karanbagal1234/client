import React from "react";
import { Link } from "react-router-dom";
import { FaQrcode, FaStore, FaGift, FaUser, FaShoppingCart, FaChartLine } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {

  
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to MyStore</h1>
          <p className="text-xl mb-8">
            Revolutionize your shopping experience with seamless QR-based transactions and loyalty rewards.
          </p>
          <div className="space-x-4">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose MyStore?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <FaQrcode className="text-5xl text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">QR-Based Shopping</h3>
              <p className="text-gray-600">
                Scan QR codes to instantly access store products and add them to your cart.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <FaGift className="text-5xl text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Loyalty Rewards</h3>
              <p className="text-gray-600">
                Earn points on every purchase and redeem them for exciting rewards.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <FaChartLine className="text-5xl text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Business Analytics</h3>
              <p className="text-gray-600">
                Retailers can track sales, manage inventory, and monitor customer behavior.  67a501513c3f63c862c23ac4
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="text-5xl font-bold text-blue-600 mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Scan the QR Code</h3>
              <p className="text-gray-600">
                Use your phone to scan the store's QR code and start shopping.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="text-5xl font-bold text-blue-600 mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Browse & Add to Cart</h3>
              <p className="text-gray-600">
                Explore products, adjust quantities, and add items to your cart.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="text-5xl font-bold text-blue-600 mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Checkout & Earn Rewards</h3>
              <p className="text-gray-600">
                Complete your purchase and earn loyalty points for future discounts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-gray-600 mb-4">
                "MyStore has completely transformed how I shop. The QR system is so convenient, and the rewards are amazing!"
              </p>
              <div className="flex items-center">
                <img
                  src="https://via.placeholder.com/50"
                  alt="User"
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold">John Doe</h4>
                  <p className="text-sm text-gray-500">Happy Customer</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-gray-600 mb-4">
                "As a retailer, the analytics dashboard has helped me understand my customers better and grow my business."
              </p>
              <div className="flex items-center">
                <img
                  src="https://via.placeholder.com/50"
                  alt="User"
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold">Jane Smith</h4>
                  <p className="text-sm text-gray-500">Retailer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8">
            Join thousands of users and retailers who are already enjoying the benefits of MyStore.
          </p>
          <Link
            to="/register"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all"
          >
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;