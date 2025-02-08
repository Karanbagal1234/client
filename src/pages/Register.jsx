import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/auth";
import useRedirect from "../services/AuthChecker";
import { notification } from "../utils/feedback";
import { useTheme } from "../context/ThemeContex";

const RegisterPage = () => {
  const { user, retailer } = useAuth(); // Consume the AuthContext to access the login function
  const redirect = useRedirect();
  const theme = useTheme(); // Access theme colors

  const [isRetailer, setIsRetailer] = useState(false);
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    Password: "",
    PhoneNumber: "",
    Address: "",
    StoreName: "",
    StoreAddress: "",
    BusinessRegistrationNumber: "",
    TaxIdentificationNumber: "",
    OperatingHours: "",
    PaymentMethods: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (e) => {
    setIsRetailer(e.target.value === "retailer");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res = await authService.register(formData, isRetailer);
      if (res.data && res.data.message) {
        notification.info(res.data.message);
      }

      if (res.status === 201) {
        notification.success("Registration successful! You can now log in.");
        redirect.redirectTo("/login");
      } else if (res.status === 400) {
        notification.warning("This email is already registered. Try logging in.");
      } else if (res.status === 500) {
        notification.error("Oops! Something went wrong on our end. Please try again later.");
      } else {
        notification.error("Unexpected error. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      notification.error("Could not complete registration. Check your details and try again.");
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
          {isRetailer ? "Retailer Register" : "User Register"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label
              htmlFor="Name"
              className="block text-sm font-medium"
              style={{ color: theme.powderBlue }} // Use theme color for label
            >
              Name
            </label>
            <input
              type="text"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
              placeholder="Enter your name"
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

          {/* Email */}
          <div>
            <label
              htmlFor="Email"
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
              htmlFor="Password"
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

          {/* Phone Number */}
          <div>
            <label
              htmlFor="PhoneNumber"
              className="block text-sm font-medium"
              style={{ color: theme.powderBlue }} // Use theme color for label
            >
              Phone Number
            </label>
            <input
              type="text"
              name="PhoneNumber"
              value={formData.PhoneNumber}
              onChange={handleChange}
              placeholder="Enter your phone number"
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

          {/* Address */}
          <div>
            <label
              htmlFor="Address"
              className="block text-sm font-medium"
              style={{ color: theme.powderBlue }} // Use theme color for label
            >
              Address
            </label>
            <input
              type="text"
              name="Address"
              value={formData.Address}
              onChange={handleChange}
              placeholder="Enter your address"
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

          {/* Retailer-Specific Fields */}
          {isRetailer && (
            <>
              <div>
                <label
                  htmlFor="StoreName"
                  className="block text-sm font-medium"
                  style={{ color: theme.powderBlue }} // Use theme color for label
                >
                  Store Name
                </label>
                <input
                  type="text"
                  name="StoreName"
                  value={formData.StoreName}
                  onChange={handleChange}
                  placeholder="Enter your store name"
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

              <div>
                <label
                  htmlFor="StoreAddress"
                  className="block text-sm font-medium"
                  style={{ color: theme.powderBlue }} // Use theme color for label
                >
                  Store Address
                </label>
                <input
                  type="text"
                  name="StoreAddress"
                  value={formData.StoreAddress}
                  onChange={handleChange}
                  placeholder="Enter your store address"
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

              <div>
                <label
                  htmlFor="BusinessRegistrationNumber"
                  className="block text-sm font-medium"
                  style={{ color: theme.powderBlue }} // Use theme color for label
                >
                  Business Registration Number
                </label>
                <input
                  type="text"
                  name="BusinessRegistrationNumber"
                  value={formData.BusinessRegistrationNumber}
                  onChange={handleChange}
                  placeholder="Enter your business registration number"
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

              <div>
                <label
                  htmlFor="TaxIdentificationNumber"
                  className="block text-sm font-medium"
                  style={{ color: theme.powderBlue }} // Use theme color for label
                >
                  Tax Identification Number
                </label>
                <input
                  type="text"
                  name="TaxIdentificationNumber"
                  value={formData.TaxIdentificationNumber}
                  onChange={handleChange}
                  placeholder="Enter your tax identification number"
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

              <div>
                <label
                  htmlFor="OperatingHours"
                  className="block text-sm font-medium"
                  style={{ color: theme.powderBlue }} // Use theme color for label
                >
                  Operating Hours
                </label>
                <input
                  type="text"
                  name="OperatingHours"
                  value={formData.OperatingHours}
                  onChange={handleChange}
                  placeholder="Enter your store operating hours"
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

              <div>
                <label
                  htmlFor="PaymentMethods"
                  className="block text-sm font-medium"
                  style={{ color: theme.powderBlue }} // Use theme color for label
                >
                  Payment Methods
                </label>
                <input
                  type="text"
                  name="PaymentMethods"
                  value={formData.PaymentMethods}
                  onChange={handleChange}
                  placeholder="Enter your payment methods"
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
            </>
          )}

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
              Register
            </button>
          </div>
        </form>

        {/* Login Link */}
        <div className="mt-4 text-center">
          <p
            className="text-sm"
            style={{ color: theme.powderBlue }} // Use theme color for text
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium transition-all duration-300 ease-in-out"
              style={{ color: theme.lavenderWeb }} // Use theme color for link
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;