import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [retailer, setRetailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChatBot, setShowChatBot] = useState(false); // Default to hidden
  const [spendingLimit, setSpendingLimit] = useState(null); // Custom spending limit

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isRetailer = localStorage.getItem("isRetailer") === "true";
        const { data } = await authService.getProfile(isRetailer);

        if (isRetailer) {
          setRetailer(data.retailer);
        } else {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        localStorage.removeItem("isRetailer");
        setUser(null);
        setRetailer(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials, isRetailer) => {
    try {
      const data = await authService.login(credentials, isRetailer);
      localStorage.setItem("isRetailer", isRetailer);

      if (isRetailer) {
        setRetailer(data.data.retailer);
      } else {
        setUser(data.data.user);
      }
      return data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async (isRetailer) => {
    try {
      await authService.logout(isRetailer);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("isRetailer");
      setUser(null);
      setRetailer(null);
    }
  };

  // Toggle Chatbot Visibility
  const toggleChatBot = () => setShowChatBot((prev) => !prev);

  // Set Spending Limit
  const setLimit = (limit) => {
    setSpendingLimit(limit);
    localStorage.setItem("spendingLimit", limit); // Persist limit in localStorage
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        retailer,
        loading,
        login,
        logout,
        showChatBot,
        toggleChatBot,
        spendingLimit,
        setLimit, // Expose setLimit function
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);