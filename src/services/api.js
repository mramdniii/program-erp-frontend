import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Generic API calls
const apiService = {
  // Product Groups
  getProdGroups: () => api.get('/prod-groups'),
  createProdGroup: (data) => api.post('/prod-groups', data),
  updateProdGroup: (id, data) => api.put(`/prod-groups/${id}`, data),
  deleteProdGroup: (id) => api.delete(`/prod-groups/${id}`),

  // Vendors
  getVendors: () => api.get('/vendors'),
  createVendor: (data) => api.post('/vendors', data),
  updateVendor: (id, data) => api.put(`/vendors/${id}`, data),
  deleteVendor: (id) => api.delete(`/vendors/${id}`),

  // Customers
  getCustomers: () => api.get('/customers'),
  createCustomer: (data) => api.post('/customers', data),
  updateCustomer: (id, data) => api.put(`/customers/${id}`, data),
  deleteCustomer: (id) => api.delete(`/customers/${id}`),

  // Products
  getProducts: () => api.get('/products'),
  getProduct: (id) => api.get(`/products/${id}`),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),

  // Purchase Orders
  getPurchaseOrders: () => api.get('/purchase-orders'),
  getPurchaseOrder: (id) => api.get(`/purchase-orders/${id}`),
  createPurchaseOrder: (data) => api.post('/purchase-orders', data),
  updatePurchaseOrder: (id, data) => api.put(`/purchase-orders/${id}`, data),
  deletePurchaseOrder: (id) => api.delete(`/purchase-orders/${id}`),

  // Sales Orders
  getSalesOrders: () => api.get('/sales-orders'),
  getSalesOrder: (id) => api.get(`/sales-orders/${id}`),
  createSalesOrder: (data) => api.post('/sales-orders', data),
  updateSalesOrder: (id, data) => api.put(`/sales-orders/${id}`, data),
  deleteSalesOrder: (id) => api.delete(`/sales-orders/${id}`),

  // Stock List
  getStockList: () => api.get('/stock-list'),
  getStockByProduct: (id) => api.get(`/stock-list/product/${id}`),

  // Stock Adjust
  getStockAdjusts: () => api.get('/stock-adjust'),
  createStockAdjust: (data) => api.post('/stock-adjust', data),
  deleteStockAdjust: (id) => api.delete(`/stock-adjust/${id}`),

  // Godown Diary
  getGodownDiary: (godown) => api.get('/godown-diary', { params: { godown } }),
  getGodownDiaryByProduct: (id) => api.get(`/godown-diary/product/${id}`),
};

export default apiService;
