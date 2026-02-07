import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'
import { productsAPI } from '../services/api'

const ProductContext = createContext()

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch all products on mount
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await productsAPI.getAll()
      setProducts(data)
    } catch (err) {
      console.error('Error fetching products:', err)
      const errorMessage = err.response?.data?.error || 'Failed to fetch products'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const addProduct = async (formData) => {
    try {
      const response = await productsAPI.create(formData)
      await fetchProducts() // Refresh the list
      return response
    } catch (err) {
      console.error('Error creating product:', err)
      throw new Error(err.response?.data?.error || 'Failed to create product')
    }
  }

  const updateProduct = async (id, formData) => {
    try {
      const response = await productsAPI.update(id, formData)
      await fetchProducts() // Refresh the list
      return response
    } catch (err) {
      console.error('Error updating product:', err)
      throw new Error(err.response?.data?.error || 'Failed to update product')
    }
  }

  const removeProduct = async (id) => {
    try {
      await productsAPI.delete(id)
      await fetchProducts() // Refresh the list
    } catch (err) {
      console.error('Error deleting product:', err)
      throw new Error(err.response?.data?.error || 'Failed to delete product')
    }
  }

  const getProduct = (id) => {
    return products.find(p => p._id === id)
  }

  const stats = useMemo(() => {
    const total = products.length
    const byCategory = products.reduce((acc, p) => {
      if (Array.isArray(p.category)) {
        p.category.forEach(cat => {
          acc[cat] = (acc[cat] || 0) + 1
        })
      } else if (p.category) {
        acc[p.category] = (acc[p.category] || 0) + 1
      }
      return acc
    }, {})
    return { total, byCategory }
  }, [products])

  const categories = useMemo(() => {
    const cats = new Set()
    products.forEach(p => {
      if (Array.isArray(p.category)) {
        p.category.forEach(cat => cats.add(cat))
      } else if (p.category) {
        cats.add(p.category)
      }
    })
    return ['All', ...Array.from(cats).sort()]
  }, [products])

  const value = {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    removeProduct,
    getProduct,
    stats,
    categories,
    refreshProducts: fetchProducts,
  }

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
}

export function useProducts() {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider')
  }
  return context
}
