'use client'

import { useQuery } from '@tanstack/react-query'
import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance'
import Link from 'next/link'
import React from 'react'
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  DollarSign,
  Search,
  Download,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
  Loader2,
  XCircle,
  Package,
  Calendar
} from 'lucide-react'

const OrdersPage = () => {
  const [page, setPage] = React.useState(1)
  const [search, setSearch] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('All Orders')
  const limit = 20

  const {
    data,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['seller-orders', page, limit],
    queryFn: async () => {
      const res = await axiosInstance.get('/products/get-orders', {
        params: { page, limit },
      })
      return res.data as {
        success?: boolean
        orders?: any[]
        total?: number
        count?: number
        meta?: any
      }
    },
    staleTime: 10_000,
  })

  const rawOrders = data?.orders ?? []
  const meta = data?.meta

  const orders = React.useMemo(() => {
    return rawOrders.map((order: any) => ({
      id: order.id,
      customer: order.user?.name ?? '—',
      customerEmail: order.user?.email,
      product: order.product?.name ?? '—',
      amount:
        typeof order.totalPrice === 'number'
          ? `₹${order.totalPrice.toFixed(2)}`
          : `₹${(order.product?.price ?? 0).toFixed(2)}`,
      payment: order.payment?.status ?? 'PENDING',
      status: order.status,
      date: order.createdAt
        ? new Date(order.createdAt).toLocaleDateString()
        : '—',
    }))
  }, [rawOrders])

  // Filter orders based on search and status
  const filteredOrders = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    return orders.filter((order) => {
      const matchesStatus = statusFilter === 'All Orders' || order.status === statusFilter.toUpperCase()
      if (!q) return matchesStatus
      const haystack = [
        order.id,
        order.customer,
        order.customerEmail,
        order.product,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return matchesStatus && haystack.includes(q)
    })
  }, [orders, search, statusFilter])

  const total_orders = data?.total ?? data?.count ?? 0
  const pending_orders = rawOrders.filter((o: any) => o.status === 'PENDING').length
  const delivered_orders = rawOrders.filter((o: any) => o.status === 'DELIVERED').length
  const revenue = rawOrders
    .filter((o: any) => o.payment?.status === 'PAID')
    .reduce(
      (acc: number, o: any) =>
        acc +
        (typeof o.totalPrice === 'number'
          ? o.totalPrice
          : o.product?.price ?? 0),
      0
    )

  const getStatusColor = (status: string) => {
    const colors = {
      'DELIVERED': 'bg-green-500/20 text-green-400 border-green-500/20',
      'PENDING': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20',
      'CANCELLED': 'bg-red-500/20 text-red-400 border-red-500/20',
      'PROCESSING': 'bg-blue-500/20 text-blue-400 border-blue-500/20',
      'SHIPPED': 'bg-purple-500/20 text-purple-400 border-purple-500/20'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-500/20 text-gray-400 border-gray-500/20'
  }

  const getStatusIcon = (status: string) => {
    const icons = {
      'DELIVERED': <CheckCircle className="w-3 h-3" />,
      'PENDING': <Clock className="w-3 h-3" />,
      'CANCELLED': <XCircle className="w-3 h-3" />,
      'PROCESSING': <Loader2 className="w-3 h-3 animate-spin" />,
      'SHIPPED': <Package className="w-3 h-3" />
    }
    return icons[status as keyof typeof icons] || null
  }

  const getPaymentColor = (status: string) => {
    const colors = {
      'PAID': 'bg-green-500/20 text-green-400 border-green-500/20',
      'PENDING': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20',
      'FAILED': 'bg-red-500/20 text-red-400 border-red-500/20',
      'REFUNDED': 'bg-purple-500/20 text-purple-400 border-purple-500/20'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-500/20 text-gray-400 border-gray-500/20'
  }

  const stats = [
    {
      title: 'Total Orders',
      value: total_orders,
      icon: ShoppingBag,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/10 to-cyan-500/10'
    },
    {
      title: 'Pending',
      value: pending_orders,
      icon: Clock,
      gradient: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-500/10 to-orange-500/10'
    },
    {
      title: 'Delivered',
      value: delivered_orders,
      icon: CheckCircle,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-500/10 to-emerald-500/10'
    },
    {
      title: 'Revenue',
      value: `₹${revenue.toFixed(2)}`,
      icon: DollarSign,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-500/10 to-pink-500/10'
    }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0d0d14] to-[#0f0f1a] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
          <p className="text-gray-400 text-lg">Loading orders...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0d0d14] to-[#0f0f1a] flex items-center justify-center p-6">
        <div className="bg-gray-800/40 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8 max-w-md w-full text-center">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Failed to Load Orders</h2>
          <p className="text-gray-400 text-sm">There was an error loading your orders. Please try again.</p>
          <button 
            onClick={() => refetch()}
            className="mt-6 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/25"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0d0d14] to-[#0f0f1a] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
              Orders
            </h1>
            <p className="text-gray-400 mt-2 flex items-center gap-2">
              <span>Track and manage all customer orders</span>
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse" />
            </p>
          </div>
          <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/25 w-fit">
            <Download className="w-4 h-4" />
            Export Orders
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group bg-gray-800/40 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition-all duration-300 hover:shadow-2xl hover:shadow-black/20"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-white mt-2 tracking-tight">
                    {stat.value}
                  </h3>
                </div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.bgGradient} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-6 h-6 bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Orders Table */}
        <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition-all duration-300">
          {/* Top Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
              <p className="text-gray-400 text-sm mt-1">View all recent customer purchases</p>
            </div>

            <div className="flex gap-3 flex-col sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-gray-700/30 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 w-full sm:w-48 md:w-56"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 bg-gray-700/30 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 cursor-pointer"
              >
                <option>All Orders</option>
                <option>Pending</option>
                <option>Processing</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>

              {/* Pagination */}
              <div className="flex items-center gap-2">
                {meta ? (
                  <span className="text-sm text-gray-500 hidden lg:block">
                    Page {meta.page} of {meta.totalPages}
                  </span>
                ) : null}

                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={isLoading || !meta?.hasPrev}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl border border-gray-700 bg-gray-700/30 text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={isLoading || !meta?.hasNext}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-3">
                <ShoppingBag className="w-16 h-16 text-gray-600 opacity-30" />
                <p className="text-gray-400 text-lg">No orders found</p>
                <p className="text-gray-500 text-sm">Try adjusting your search or filter</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px]">
                <thead>
                  <tr className="border-b border-gray-700/50 text-left">
                    <th className="pb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="pb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="pb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="pb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="pb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="pb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="pb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="pb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-700/30 hover:bg-white/5 transition-all duration-200 group"
                    >
                      <td className="py-4 font-mono text-sm text-gray-300">
                        #{order.id.slice(0, 8)}
                      </td>
                      <td className="py-4">
                        <div>
                          <p className="font-medium text-white group-hover:text-blue-400 transition-colors">
                            {order.customer}
                          </p>
                          {order.customerEmail ? (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {order.customerEmail}
                            </p>
                          ) : null}
                        </div>
                      </td>
                      <td className="py-4 text-gray-300">
                        {order.product}
                      </td>
                      <td className="py-4 font-bold text-white">
                        {order.amount}
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getPaymentColor(order.payment)}`}>
                          {order.payment}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-500" />
                          {order.date}
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex justify-end gap-2">
                          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-700/30 text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-200 text-sm">
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </button>
                          <Link href={`/dashboard/orders/${order.id}`}>
                            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm shadow-lg shadow-blue-500/20">
                              <Edit className="w-3.5 h-3.5" />
                              Update
                            </button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Bottom Pagination */}
          {meta && filteredOrders.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-700/30 mt-4">
              <p className="text-sm text-gray-500">
                Showing <span className="text-gray-300">{((meta.page - 1) * limit) + 1}</span> to{' '}
                <span className="text-gray-300">{Math.min(meta.page * limit, meta.total)}</span> of{' '}
                <span className="text-gray-300">{meta.total}</span> orders
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={isLoading || !meta?.hasPrev}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-700 bg-gray-700/30 text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20 text-white font-medium min-w-[40px] text-center">
                  {meta.page}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={isLoading || !meta?.hasNext}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrdersPage