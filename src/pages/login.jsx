import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { notification } from "../utils/feedback";
import useRedirect from "../services/AuthChecker";
import { useTheme } from "../context/ThemeContex";

const LoginPage = () => {
  const { login } = useAuth();
  const { redirectTo } = useRedirect();
  const theme = useTheme(); // Access theme colors

  const [isRetailer, setIsRetailer] = useState(false);
  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value.trim(), // Trim spaces to prevent accidental errors
    });
  };

  const handleRoleChange = (e) => {
    const isRetailer = e.target.value === "retailer";
    setIsRetailer(isRetailer);
    localStorage.setItem("isRetailer", isRetailer); // Update localStorage immediately
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error on new login attempt

    try {
      const response = await login(formData, isRetailer);
      console.log("Login Response:", response);
      console.log(response);

      if (response?.status === 200) {
        notification.success("Login successful! Redirecting...");
        redirectTo(isRetailer ? "/Retailer" : "/Home"); // Navigate based on user type
      } else {
        notification.warning("Invalid email or password. Please try again.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Unable to log in. Check your details and try again.");
      notification.error("Unable to log in. Check your details and try again.");
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen transition-all duration-300 ease-in-out"
      style={{ backgroundColor: theme.richBlack }} // Use theme color for background
    >
      <div
        className="p-8 rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-500 ease-in-out animate-fadeIn"
        style={{ backgroundColor: theme.oxfordBlue }} // Use theme color for card background
      >
        <h2
          className="text-3xl font-semibold mb-6 text-center"
          style={{ color: theme.lavenderWeb }} // Use theme color for text
        >
          {isRetailer ? "Retailer Login" : "User Login"}
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label
              className="block text-sm font-medium"
              style={{ color: theme.powderBlue }} // Use theme color for label
            >
              Email
            </label>
            <input
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-opacity-50 transition-all duration-300 ease-in-out"
              style={{
                backgroundColor: theme.ultraViolet,
                borderColor: theme.powderBlue,
                color: theme.lavenderWeb,
                focusRingColor: theme.powderBlue,
              }} // Use theme colors for input
            />
          </div>

          {/* Password */}
          <div>
            <label
              className="block text-sm font-medium"
              style={{ color: theme.powderBlue }} // Use theme color for label
            >
              Password
            </label>
            <input
              type="password"
              name="Password"
              value={formData.Password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-opacity-50 transition-all duration-300 ease-in-out"
              style={{
                backgroundColor: theme.ultraViolet,
                borderColor: theme.powderBlue,
                color: theme.lavenderWeb,
                focusRingColor: theme.powderBlue,
              }} // Use theme colors for input
            />
          </div>

          {/* User or Retailer Selection */}
          <div className="flex items-center justify-between">
            <div>
              <label
                className="inline-flex items-center text-sm"
                style={{ color: theme.powderBlue }} // Use theme color for label
              >
                <input
                  type="radio"
                  value="user"
                  checked={!isRetailer}
                  onChange={handleRoleChange}
                  className="mr-2"
                />
                User
              </label>
              <label
                className="inline-flex items-center text-sm ml-6"
                style={{ color: theme.powderBlue }} // Use theme color for label
              >
                <input
                  type="radio"
                  value="retailer"
                  checked={isRetailer}
                  onChange={handleRoleChange}
                  className="mr-2"
                />
                Retailer
              </label>
            </div>
            <button
              type="submit"
              className="px-6 py-2 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300 ease-in-out"
              style={{
                backgroundColor: theme.powderBlue,
                color: theme.richBlack,
                hoverBackgroundColor: theme.ultraViolet,
                focusRingColor: theme.powderBlue,
              }} // Use theme colors for button
            >
              Login
            </button>
          </div>
        </form>

        {/* Links for Registration & Password Reset */}
        <div className="mt-4 text-center">
          <p
            className="text-sm"
            style={{ color: theme.powderBlue }} // Use theme color for text
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium transition-all duration-300 ease-in-out"
              style={{ color: theme.lavenderWeb }} // Use theme color for link
            >
              Register here
            </Link>
          </p>
          <p
            className="text-sm mt-2"
            style={{ color: theme.powderBlue }} // Use theme color for text
          >
            <Link
              to="/reset-password"
              className="font-medium transition-all duration-300 ease-in-out"
              style={{ color: theme.lavenderWeb }} // Use theme color for link
            >
              Forgot Password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;