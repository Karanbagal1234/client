import api from "./api";

export const StoreService = {
  /**
   * 🛒 Start a store session
   * Automatically scans the product and adds it to the cart if a session exists.
   * @param {Object} data - Scanned product data
   * @returns {Promise} API response
   */
  startStoreSession: async (data) => {
    return api.post("/store/scan", data);
  },

  /**
   * 📝 Update product quantity in the cart
   * @param {Object} params - Contains productId & quantity
   * @returns {Promise} API response
   */
  updateCart: async ({ productId, quantity }) => {
    return api.post("/cart/update-cart", { productId, quantity });
  },

  /**
   * 🏪 Get store details by store ID
   * @param {string} storeId - Store identifier
   * @returns {Promise} API response
   */
  getStoreDetails: async (storeId) => {
    return api.post("/store/get-store-detail", { storeId });
  },

  /**
   * ❌ Remove a product from the cart
   * @param {string} productId - ID of the product to remove
   * @returns {Promise} API response
   */
  removeFromCart: async (productId) => {
    return api.delete("/cart/remove", {
      data: { productId }, // Ensures proper DELETE request format
    });
  },

  /**
   * 📜 Get user cart history
   * @param {string} userId - The ID of the user whose cart history is needed
   * @returns {Promise} API response
   */
  getCartHistory: async (userId) => {
    return api.get(`/cart/user/cart-history/${userId}`);
  },

  /**
   * 🛑 Clear the cart
   * Optional feature - backend route may be required
   * @returns {Promise} API response
   */
  clearCart: async () => {
    return api.delete("/cart/clear");
  },
};
