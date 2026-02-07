import { useMemo, useState } from 'react'
import ProductCard from '../components/ProductCard'
import Pagination from '../components/Pagination'
import { useProducts } from '../context/ProductContext'

export default function Products() {
  const { products, loading, categories } = useProducts()
  const [query, setQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState(new Set())
  const [page, setPage] = useState(1)
  const perPage = 16

  const filtered = useMemo(() => {
    if (loading) return []
    
    const q = query.trim().toLowerCase()
    const cats = selectedCategories.size === 0 ? null : selectedCategories
    
    return products.filter((p) => {
      // Handle category matching - can be array or string
      let productCategories = []
      if (Array.isArray(p.category)) {
        productCategories = p.category
      } else if (p.category) {
        productCategories = [p.category]
      }

      const categoryMatch = cats === null || productCategories.some(cat => cats.has(cat))
      
      // Handle name matching - support both product_name and name
      const productName = (p.product_name || p.name || '').toLowerCase()
      const nameMatch = q === '' || productName.includes(q)
      
      return categoryMatch && nameMatch
    })
  }, [query, selectedCategories, products, loading])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const pageItems = filtered.slice((page-1) * perPage, page * perPage)

  function toggleCategory(cat) {
    setPage(1)
    setSelectedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  function onSearchChange(e) {
    setQuery(e.target.value)
    setPage(1)
  }

  if (loading) {
    return (
      <section className="container py-5">
        <div className="text-center py-20">
          <p className="text-gray-600">Loading products...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="container py-5">
      <div className="mt-4 mb-6 grid md:grid-cols-[360px,1fr] lg:grid-cols-[300px,1fr] items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-extrabold text-brandDark"> All <span className='text-yellow-400'>Products</span></h1>
        <div className="flex justify-center md:justify-center">
          <div className="inline-block transform -skew-x-12 bg-gradient-to-r from-pink-500 to-pink-600 px-8 md:px-10 py-3 rounded-md md:min-w-[520px]">
            <h2 className="skew-x-12 text-base md:text-lg lg:text-xl font-semibold text-white text-center">Manage your product catalog</h2>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-[380px,1fr] lg:grid-cols-[300px,1fr] gap-6">
        <aside className="space-y-6 px-2 md:px-2">
          <input
            value={query}
            onChange={onSearchChange}
            placeholder="Search products..."
            className="w-full border rounded-md px-4 py-3 md:px-5 md:py-3 text-sm md:text-base"
          />

          <div>
            <label className="block text-sm md:text-base font-semibold text-gray-700 mb-2">Search by Category</label>
            <div className="space-y-3">
              {categories.filter(c => c !== 'All').map((c) => (
                <label key={c} className="flex items-center gap-3 text-sm md:text-base">
                  <input
                    type="checkbox"
                    checked={selectedCategories.has(c)}
                    onChange={() => toggleCategory(c)}
                    className="h-5 w-5 md:h-6 md:w-6"
                  />
                  <span className="leading-tight">{c}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        <div>
          {pageItems.length === 0 ? (
            <p className="text-gray-600">No products found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {pageItems.map((p) => <ProductCard key={p._id || p.id} product={p} />)}
            </div>
          )}

          <div className="mt-6">
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        </div>
      </div>
    </section>
  )
}
