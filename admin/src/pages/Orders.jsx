import { useState, useEffect, useMemo } from 'react'
import { ordersAPI } from '../services/api'
import { toast } from 'react-toastify'
import Pagination from '../components/Pagination'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
}

const statusIcons = {
  pending: ClockIcon,
  processing: ArrowPathIcon,
  completed: CheckCircleIcon,
  cancelled: XCircleIcon
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const perPage = 10

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const data = await ordersAPI.getAll()
      setOrders(data)
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(() => {
    let result = orders

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter)
    }

    // Filter by search query
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      result = result.filter(order => {
        const customerName = (order.customer_name || '').toLowerCase()
        const email = (order.email || '').toLowerCase()
        const phone = (order.phone || '').toLowerCase()
        const company = (order.company || '').toLowerCase()
        const orderId = order._id?.toString().toLowerCase() || ''
        
        return customerName.includes(q) || 
               email.includes(q) || 
               phone.includes(q) || 
               company.includes(q) ||
               orderId.includes(q)
      })
    }

    return result
  }, [orders, statusFilter, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage)

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTotalItems = (order) => {
    return order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
  }

  if (loading) {
    return (
      <section className="container py-5">
        <div className="text-center py-20">
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="container py-5">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-brandDark">
          All <span className="text-yellow-400">Orders</span>
        </h1>
        <p className="text-gray-600 mt-2">Manage and view customer orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-brandDark">{orders.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {orders.filter(o => o.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Processing</p>
          <p className="text-2xl font-bold text-blue-600">
            {orders.filter(o => o.status === 'processing').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Completed</p>
          <p className="text-2xl font-bold text-green-600">
            {orders.filter(o => o.status === 'completed').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setPage(1)
              }}
              placeholder="Search by name, email, phone, company, or order ID..."
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brandBlue"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(1)
              }}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brandBlue appearance-none bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {pageItems.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-600">No orders found.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {pageItems.map((order) => {
              const StatusIcon = statusIcons[order.status] || ClockIcon
              return (
                <div
                  key={order._id}
                  className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {order.customer_name}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusColors[order.status] || statusColors.pending}`}>
                          <StatusIcon className="h-4 w-4" />
                          {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <EnvelopeIcon className="h-4 w-4" />
                          <span>{order.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <PhoneIcon className="h-4 w-4" />
                          <span>{order.phone}</span>
                        </div>
                        {order.company && (
                          <div className="flex items-center gap-2">
                            <BuildingOfficeIcon className="h-4 w-4" />
                            <span>{order.company}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{formatDate(order.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Items</p>
                      <p className="text-xl font-bold text-brandDark">
                        {getTotalItems(order)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {order.items?.length || 0} product{order.items?.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-brandDark">Order Details</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <UserIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium text-gray-900">{selectedOrder.customer_name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{selectedOrder.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <PhoneIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium text-gray-900">{selectedOrder.phone}</p>
                    </div>
                  </div>
                  {selectedOrder.company && (
                    <div className="flex items-start gap-3">
                      <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Company</p>
                        <p className="font-medium text-gray-900">{selectedOrder.company}</p>
                      </div>
                    </div>
                  )}
                  {selectedOrder.location && (
                    <div className="flex items-start gap-3">
                      <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-medium text-gray-900">{selectedOrder.location}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Order Date</p>
                      <p className="font-medium text-gray-900">{formatDate(selectedOrder.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    {(() => {
                      const StatusIcon = statusIcons[selectedOrder.status] || ClockIcon
                      return <StatusIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    })()}
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColors[selectedOrder.status] || statusColors.pending}`}>
                        {selectedOrder.status?.charAt(0).toUpperCase() + selectedOrder.status?.slice(1) || 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 flex gap-4"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.product_name}
                          className="w-20 h-20 object-contain bg-gray-50 rounded"
                          onError={(e) => {
                            e.target.src = '/placeholder.png'
                            e.target.onerror = null
                          }}
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {item.product_name}
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Quantity: </span>
                            <span>{item.quantity}</span>
                          </div>
                          {/* SKU removed */}
                          {item.brand && (
                            <div>
                              <span className="font-medium">Brand: </span>
                              <span>{item.brand}</span>
                            </div>
                          )}
                          <div>
                            <span className="font-medium">Product ID: </span>
                            <span className="text-xs font-mono">{item.product_id}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-lg font-semibold text-gray-900">
                    Total Items: {getTotalItems(selectedOrder)}
                  </p>
                </div>
              </div>

              {/* Order ID */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Order ID</p>
                <p className="font-mono text-sm text-gray-900">{selectedOrder._id}</p>
              </div>

              {/* Status Update */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h3>
                <div className="flex flex-wrap gap-2">
                  {['pending', 'processing', 'completed', 'cancelled'].map((status) => {
                    const StatusIcon = statusIcons[status]
                    const isCurrent = selectedOrder.status === status
                    return (
                      <button
                        key={status}
                        onClick={async () => {
                          try {
                            await ordersAPI.updateStatus(selectedOrder._id, status)
                            toast.success(`Order status updated to ${status}`)
                            setSelectedOrder({ ...selectedOrder, status })
                            fetchOrders()
                          } catch (error) {
                            toast.error(error.response?.data?.error || 'Failed to update status')
                          }
                        }}
                        disabled={isCurrent}
                        className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                          isCurrent
                            ? `${statusColors[status]} cursor-not-allowed`
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <StatusIcon className="h-4 w-4" />
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                        {isCurrent && ' (Current)'}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

