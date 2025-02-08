import api from "./api";

export const cartService = {
 
  ScanProduct: async ({ productId }) => {
    return api.post("/product/scan", { productId });
  },

  updateCart: async ({ productId, quantity }) => {
    return api.post("/cart/update-cart", { productId, quantity });
  },

  removeFromCart: async (productId) => {
    return api.delete(`/cart/remove`, {
      data: { productId },
    });
  },
  addToCart: async ({ productId, quantity }) => {
    return api.post(`/product/addToCart`, { productId, quantity });
  },
getProductDetails: async (data) => {
  
  console.log("data : " + JSON.stringify(data))
    return api.post(`/product/getProducts`,data);
  },
  getPurchaseHistory: async () => {
    return api.get(`/cart/recent/purchases`);
  },
  getRecipt: async (data) =>{
    return api.post(`/receipt/generate`,data)
  }
};
