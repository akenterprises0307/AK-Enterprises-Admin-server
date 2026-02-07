import { useProducts } from '../context/ProductContext'
import { useNavigate } from 'react-router-dom'
import { 
  ChartBarIcon, 
  CubeIcon, 
  PlusCircleIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline'

export default function Dashboard() {
  const { products, stats, loading } = useProducts()
  const navigate = useNavigate()

  const categoryStats = Object.entries(stats.byCategory).map(([cat, count]) => ({
    category: cat,
    count,
    percentage: stats.total > 0 ? ((count / stats.total) * 100).toFixed(1) : 0
  }))

  if (loading) {
    return (
      <section className="container py-8">
        <div className="text-center py-20">
          <p className="text-gray-600">Loading...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-brandDark">
          Admin <span className="text-yellow-400">Dashboard</span>
        </h1>
        <p className="text-gray-600 mt-2">Manage your product catalog and view statistics</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Products</p>
              <p className="text-3xl font-bold text-brandDark">{stats.total}</p>
            </div>
            <div className="bg-brandBlue/10 p-3 rounded-lg">
              <CubeIcon className="h-8 w-8 text-brandBlue" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Categories</p>
              <p className="text-3xl font-bold text-brandDark">{categoryStats.length}</p>
            </div>
            <div className="bg-brandAccent/10 p-3 rounded-lg">
              <ChartBarIcon className="h-8 w-8 text-brandAccent" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Quick Actions</p>
              <button
                onClick={() => navigate('/products')}
                className="text-brandBlue font-semibold flex items-center gap-1 mt-2 hover:text-brandAccent"
              >
                View All <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="bg-yellow-400/10 p-3 rounded-lg">
              <PlusCircleIcon className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Statistics */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-brandDark mb-4">Products by Category</h2>
          <div className="space-y-4">
            {categoryStats.length > 0 ? (
              categoryStats.map(({ category, count, percentage }) => (
                <div key={category}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">{category}</span>
                    <span className="text-sm text-gray-600">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-brandBlue h-2.5 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No categories yet</p>
            )}
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-brandDark mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <button
              onClick={() => navigate('/add-product')}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              <PlusCircleIcon className="h-5 w-5" />
              Add New Product
            </button>
            <button
              onClick={() => navigate('/products')}
              className="w-full btn-outline flex items-center justify-center gap-2"
            >
              View All Products
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
