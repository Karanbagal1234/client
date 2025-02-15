import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/auth";
import { notification } from "../utils/feedback";
import useRedirect from "../services/AuthChecker";

const RegisterPage = () => {
  const [isRetailer, setIsRetailer] = useState(true);
  const [formData, setFormData] = useState({
    Name:"",
    Email: "",
    Password: "",
    PhoneNumber: "",
    Address: isRetailer ? undefined : "",
    StoreName: isRetailer ? "" : undefined,
    StoreAddress: isRetailer ? "" : undefined,
  });

  const redirect = useRedirect();
  const { register } = useAuth();

  const handleRoleChange = (role) => {
    setIsRetailer(role === "retailer");
    setFormData({
      Name:"",
      Email: "",
      Password: "",
      PhoneNumber: "",
      Address: role === "retailer" ? undefined : "",
      StoreName: role === "retailer" ? "" : undefined,
      StoreAddress: role === "retailer" ? "" : undefined,
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const filteredData = Object.fromEntries(
      Object.entries(formData).filter(([_, v]) => v !== undefined)
    );
    try {
      let res = await authService.register(filteredData, isRetailer);
      if (res.status === 201) {
        notification.success("Registration successful! You can now log in.");
        redirect.redirectTo("/login");
      } else if (res.status === 400) {
        notification.warning(
          "This email is already registered. Try logging in."
        );
      } else {
        notification.error("Unexpected error. Please try again.");
      }
    } catch (error) {
      notification.error(
        "Could not complete registration. Check your details and try again."
      );
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-300 to-blue-500 min-h-screen flex items-center justify-center">
      <div className="neu-card w-screen md:w-96">
        <div className="flex justify-center mb-6 space-x-4">
          <button
            className={`neu-btn text-blue-800 ${isRetailer ? "selected" : ""}`}
            onClick={() => handleRoleChange("retailer")}
          >
            Retailer
          </button>
          <button
            className={`neu-btn text-blue-800 ${!isRetailer ? "selected" : ""}`}
            onClick={() => handleRoleChange("customer")}
          >
            Customer
          </button>
        </div>
        <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
          {isRetailer ? "Retailer Register" : "Customer Register"}
        </h2>
        <form onSubmit={handleSubmit}>
        <input
            type="text"
            name="Name"
            placeholder="Name"
            value={formData.Name}
            onChange={handleChange}
            className="w-full p-3 mb-4 bg-blue-100 text-blue-800 rounded-lg"
            required
          />
          <input
            type="email"
            name="Email"
            placeholder="Email"
            value={formData.Email}
            onChange={handleChange}
            className="w-full p-3 mb-4 bg-blue-100 text-blue-800 rounded-lg"
            required
          />
          <input
            type="password"
            name="Password"
            placeholder="Password"
            value={formData.Password}
            onChange={handleChange}
            className="w-full p-3 mb-4 bg-blue-100 text-blue-800 rounded-lg"
            required
          />
          <input
            type="tel"
            name="PhoneNumber"
            placeholder="Phone Number"
            value={formData.PhoneNumber}
            onChange={handleChange}
            className="w-full p-3 mb-4 bg-blue-100 text-blue-800 rounded-lg"
            required
          />
          {!isRetailer && (
            <input
              type="text"
              name="Address"
              placeholder="Address"
              value={formData.Address}
              onChange={handleChange}
              className="w-full p-3 mb-4 bg-blue-100 text-blue-800 rounded-lg"
              required
            />
          )}
          {isRetailer && (
            <>
              <input
                type="text"
                name="StoreName"
                placeholder="Shop Name"
                value={formData.StoreName}
                onChange={handleChange}
                className="w-full p-3 mb-4 bg-blue-100 text-blue-800 rounded-lg"
                required
              />
              <input
                type="text"
                name="StoreAddress"
                placeholder="Shop Address"
                value={formData.StoreAddress}
                onChange={handleChange}
                className="w-full p-3 mb-6 bg-blue-100 text-blue-800 rounded-lg"
                required
              />
            </>
          )}
          <button type="submit" className="neu-btn w-full text-blue-800">
            Register
          </button>
        </form>
        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
