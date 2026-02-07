import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Products API
export const productsAPI = {
  // Get all products
  getAll: async () => {
    const response = await api.get('/products')
    return response.data.products
  },

  // Get single product
  getById: async (id) => {
    const response = await api.get(`/products/${id}`)
    return response.data.product
  },

  // Create product
  create: async (formData) => {
    const response = await api.post('/products/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Update product
  update: async (id, formData) => {
    const response = await api.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Delete product
  delete: async (id) => {
    const response = await api.delete(`/products/${id}`)
    return response.data
  },
}

// Orders API
export const ordersAPI = {
  // Get all orders
  getAll: async () => {
    const response = await api.get('/orders')
    return response.data.orders
  },

  // Get single order
  getById: async (id) => {
    const response = await api.get(`/orders/${id}`)
    return response.data.order
  },

  // Update order status
  updateStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}/status`, { status })
    return response.data
  },
}

export default api

