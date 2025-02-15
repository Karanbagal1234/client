import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { notification } from "../utils/feedback";
import useRedirect from "../services/AuthChecker";
import Cookies from "js-cookie";

const LoginPage = () => {
  const { login } = useAuth();
  const { redirectTo } = useRedirect();
  const [isRetailer, setIsRetailer] = useState(false);
  const [formData, setFormData] = useState({ Email: "", Password: "" });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value.trim() });
  };

  const handleRoleChange = (role) => {
    setIsRetailer(role === "retailer");
    localStorage.setItem("isRetailer", role === "retailer");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await login(formData, isRetailer);
     const {data} = response;
      if(data.user){
        localStorage.setItem("userId", data.user._id);
      }else if(data.retailer){
        localStorage.setItem("retailerId", data.retailer._id);  
      }

      if (response?.status === 200) {
        notification.success("Login successful! Redirecting...");
        redirectTo(isRetailer ? "/Retailer" : "/Home");
      } else {
        notification.warning("Invalid email or password.");
      }
    } catch (err) {
      setError("Unable to log in. Try again.");
      notification.error("Login failed.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-300 to-blue-500 px-4 sm:px-6 lg:px-8">
      <div className="neu-card w-full max-w-md p-8 rounded-xl shadow-lg bg-[#e0e5ec] border border-gray-300">
        <div className="flex justify-center mb-6 space-x-4">
          <button
            onClick={() => handleRoleChange("retailer")}
            className={`neu-btn text-blue-800 px-6 py-3 rounded-xl bg-[#e0e5ec] shadow-[6px_6px_12px_#b8beca,-6px_-6px_12px_#ffffff] transition-all ${isRetailer ? "shadow-inner bg-blue-300" : ""}`}
          >
            Retailer
          </button>
          <button
            onClick={() => handleRoleChange("user")}
            className={`neu-btn text-blue-800 px-6 py-3 rounded-xl bg-[#e0e5ec] shadow-[6px_6px_12px_#b8beca,-6px_-6px_12px_#ffffff] transition-all ${!isRetailer ? "shadow-inner bg-blue-300" : ""}`}
          >
            Customer
          </button>
        </div>
        <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
          {isRetailer ? "Retailer Login" : "Customer Login"}
        </h2>
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="Email"
            value={formData.Email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 bg-blue-100 text-blue-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            name="Password"
            value={formData.Password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-3 bg-blue-100 text-blue-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button type="submit" className="neu-btn w-full text-blue-800 bg-[#e0e5ec] px-6 py-3 rounded-xl shadow-[6px_6px_12px_#b8beca,-6px_-6px_12px_#ffffff] hover:shadow-inner transition-all">
            Sign In
          </button>
        </form>
        <p className="text-blue-600 text-sm mt-4 text-center">
          Forgot password? <Link to="/reset-password" className="text-blue-800 font-semibold hover:underline">Reset</Link>
        </p>
        <p className="text-blue-600 text-sm mt-2 text-center">
          Don't have an account? <Link to="/register" className="text-blue-800 font-semibold hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
