import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [retailer, setRetailer] = useState(null);
  const [loading, setLoading] = useState(true);
  document.load = setLoading;
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isRetailer = localStorage.getItem("isRetailer") === "true"; // Ensure boolean conversion
        const { data } = await authService.getProfile(isRetailer);

        if (isRetailer) {
          setRetailer(data.retailer); // Set retailer data
        } else {
          setUser(data.user); // Set user data
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        // Clear any invalid session data
        localStorage.removeItem("isRetailer");
        setUser(null);
        setRetailer(null);
      } finally {
        setLoading(false); // Ensure loading is always set to false
      }
    };

      checkAuth();
 
  }, []);

  const login = async (credentials, isRetailer) => {
    try {
      const data = await authService.login(credentials, isRetailer);
      localStorage.setItem("isRetailer", isRetailer); // Store role in localStorage

      if (isRetailer) {
        setRetailer(data.data.retailer); // Set retailer data
      } else {
        setUser(data.data.user); // Set user data
      }
      return data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Propagate the error for handling in the UI
    }
  };

  const logout = async (isRetailer) => {
    try {
      await authService.logout(isRetailer);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("isRetailer"); // Clear role from localStorage
      setUser(null);
      setRetailer(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{  user, retailer, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
