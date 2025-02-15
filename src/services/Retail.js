import api from "./api";

export const retailService = {
  createProduct: async (data) => {
    return api.post("/product/create-product", data);
  },
  todayRevenue: async () => {
    return api.get("/product/today-revenue");
  },
  getProducts: async () => {
    return api.get("/product/getProductDetails");
  },
  removeProduct: async (data) => {
    return api.post("/product/remove-product", data);
  }
};
