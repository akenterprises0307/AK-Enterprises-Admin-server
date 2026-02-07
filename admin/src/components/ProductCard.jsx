import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useProducts } from '../context/ProductContext'
import { TrashIcon } from '@heroicons/react/24/outline'

export default function ProductCard({ product }) {
  const { removeProduct } = useProducts()

  const handleRemove = async (e) => {
    e.preventDefault()
    if (window.confirm(`Are you sure you want to remove "${product.product_name}"?`)) {
      try {
        await removeProduct(product._id)
        toast.success('Product deleted successfully!')
      } catch (error) {
        toast.error(error.message || 'Failed to delete product')
      }
    }
  }

  // Handle both old and new data structures
  const productName = product.product_name || product.name || 'Unnamed Product'
  const productImage = product.image || ''
  const productCategory = Array.isArray(product.category) 
    ? product.category[0] || 'Uncategorized'
    : product.category || 'Uncategorized'

  return (
    <div className="group rounded-xl border border-gray-300 overflow-hidden bg-white shadow-sm hover:shadow-md transition">
      <div className="aspect-[4.5/3] bg-gray-50 overflow-hidden">
        <img src={productImage} alt={productName} className="w-full h-full object-contain group-hover:scale-105 transition" />
      </div>
      <div className="p-4 md:px-2">
        <h4 className="font-semibold text-gray-900 line-clamp-2 min-h-[3rem]">{productName}</h4>
        <p className="text-sm text-gray-500 mt-1">{productCategory}</p>
        <div className="mt-3 flex gap-3">
          <Link to={`/product/${product._id || product.id}`} className="btn-outline text-sm">View Details</Link>
          <button 
            className="btn-danger text-sm flex items-center gap-2" 
            onClick={handleRemove}
          >
            <TrashIcon className="h-4 w-4" />
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}
