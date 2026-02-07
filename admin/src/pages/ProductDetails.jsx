import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useProducts } from '../context/ProductContext'
import { productsAPI } from '../services/api'

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { updateProduct } = useProducts()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [product, setProduct] = useState(null)
  
  const [formData, setFormData] = useState({
    product_name: '',
    short_description: '',
    long_description: '',
    brand: '',
    category: [],
    tags: [],
    features: [],
    specifications: {},
  })
  const [categoryInput, setCategoryInput] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [featureInput, setFeatureInput] = useState('')
  const [specKey, setSpecKey] = useState('')
  const [specValue, setSpecValue] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const data = await productsAPI.getById(id)
      setProduct(data)
      
      // Convert specifications Map to object if needed
      let specs = {}
      if (data.specifications) {
        if (data.specifications instanceof Map) {
          data.specifications.forEach((value, key) => {
            specs[key] = value
          })
        } else if (typeof data.specifications === 'object') {
          specs = data.specifications
        }
      }

      setFormData({
        product_name: data.product_name || '',
        short_description: data.short_description || '',
        long_description: data.long_description || '',
        brand: data.brand || '',
        category: Array.isArray(data.category) ? data.category : [],
        tags: Array.isArray(data.tags) ? data.tags : [],
        features: Array.isArray(data.features) ? data.features : [],
        specifications: specs,
      })
      setImagePreview(data.image || null)
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const addCategory = () => {
    if (categoryInput.trim()) {
      setFormData(prev => ({
        ...prev,
        category: [...prev.category, categoryInput.trim()]
      }))
      setCategoryInput('')
    }
  }

  const removeCategory = (index) => {
    setFormData(prev => ({
      ...prev,
      category: prev.category.filter((_, i) => i !== index)
    }))
  }

  const addTag = () => {
    if (tagInput.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const removeTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }))
  }

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }))
      setFeatureInput('')
    }
  }

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const addSpecification = () => {
    if (specKey.trim() && specValue.trim()) {
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specKey.trim()]: specValue.trim()
        }
      }))
      setSpecKey('')
      setSpecValue('')
    }
  }

  const removeSpecification = (key) => {
    setFormData(prev => {
      const newSpecs = { ...prev.specifications }
      delete newSpecs[key]
      return { ...prev, specifications: newSpecs }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.category.length === 0) {
      toast.error('Please add at least one category')
      return
    }

    // `features` is optional now; no validation required

    if (Object.keys(formData.specifications).length === 0) {
      toast.error('Please add at least one specification')
      return
    }

    setSubmitting(true)
    try {
      const formDataToSend = new FormData()
      if (imageFile) {
        formDataToSend.append('image', imageFile)
      }
      formDataToSend.append('product_name', formData.product_name)
      formDataToSend.append('short_description', formData.short_description)
      formDataToSend.append('long_description', formData.long_description)
      formDataToSend.append('brand', formData.brand)
      formDataToSend.append('category', JSON.stringify(formData.category))
      formDataToSend.append('tags', JSON.stringify(formData.tags))
      formDataToSend.append('features', JSON.stringify(formData.features))
      formDataToSend.append('specifications', JSON.stringify(formData.specifications))

      await updateProduct(id, formDataToSend)
      toast.success('Product updated successfully!')
      navigate('/products')
    } catch (error) {
      toast.error(error.message || 'Failed to update product')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <section className="container py-10">
        <div className="text-center py-20">
          <p className="text-gray-600">Loading product...</p>
        </div>
      </section>
    )
  }

  if (!product) {
    return (
      <section className="container py-10">
        <p>Product not found.</p>
      </section>
    )
  }

  return (
    <section className="container py-10">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-brandDark">Edit Product</h1>
        <p className="text-gray-600 mt-2">Update product details below</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
              <input
                type="text"
                name="product_name"
                value={formData.product_name}
                onChange={handleChange}
                className="w-full border rounded-md px-4 py-3"
                required
              />
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Short Description *</label>
              <input
                type="text"
                name="short_description"
                value={formData.short_description}
                onChange={handleChange}
                className="w-full border rounded-md px-4 py-3"
                required
              />
            </div>

            {/* Long Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Long Description *</label>
              <textarea
                name="long_description"
                value={formData.long_description}
                onChange={handleChange}
                rows="4"
                className="w-full border rounded-md px-4 py-3"
                required
              />
            </div>

            {/* SKU removed */}

            {/* Brand */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Brand *</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full border rounded-md px-4 py-3"
                required
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Image */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border rounded-md px-4 py-3"
              />
              {imagePreview && (
                <div className="mt-4 aspect-[4/3] bg-gray-50 rounded-lg overflow-hidden">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                </div>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                  className="flex-1 border rounded-md px-4 py-2"
                  placeholder="Add category"
                />
                <button type="button" onClick={addCategory} className="btn-outline">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.category.map((cat, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    {cat}
                    <button type="button" onClick={() => removeCategory(index)} className="text-blue-600 hover:text-blue-800">×</button>
                  </span>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 border rounded-md px-4 py-2"
                  placeholder="Add tag"
                />
                <button type="button" onClick={addTag} className="btn-outline">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    {tag}
                    <button type="button" onClick={() => removeTag(index)} className="text-gray-600 hover:text-gray-800">×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Features</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              className="flex-1 border rounded-md px-4 py-2"
              placeholder="Add feature"
            />
            <button type="button" onClick={addFeature} className="btn-outline">Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.features.map((feature, index) => (
              <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {feature}
                <button type="button" onClick={() => removeFeature(index)} className="text-green-600 hover:text-green-800">×</button>
              </span>
            ))}
          </div>
        </div>

        {/* Specifications */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Specifications *</label>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <input
              type="text"
              value={specKey}
              onChange={(e) => setSpecKey(e.target.value)}
              className="border rounded-md px-4 py-2"
              placeholder="Specification key (e.g., Battery)"
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={specValue}
                onChange={(e) => setSpecValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecification())}
                className="flex-1 border rounded-md px-4 py-2"
                placeholder="Specification value (e.g., 5000mAh)"
              />
              <button type="button" onClick={addSpecification} className="btn-outline">Add</button>
            </div>
          </div>
          <div className="space-y-1">
            {Object.entries(formData.specifications).map(([key, value]) => (
              <div key={key} className="bg-purple-100 text-purple-800 px-3 py-2 rounded text-sm flex items-center justify-between">
                <span><strong>{key}:</strong> {value}</span>
                <button type="button" onClick={() => removeSpecification(key)} className="text-purple-600 hover:text-purple-800 ml-2">×</button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Updating...' : 'Update Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="btn-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  )
}
