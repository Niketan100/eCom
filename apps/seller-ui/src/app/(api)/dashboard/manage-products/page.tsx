'use client'

import Link from 'next/link'
import React from 'react'
import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Plus,
  Search,
  Filter,
  Package,
  TrendingUp,
  AlertTriangle,
  XCircle,
  Edit,
  Trash2,
  RefreshCw,
  MoreVertical,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ShoppingBag,
  DollarSign
} from 'lucide-react'

const ManageProductsPage = () => {
  const queryClient = useQueryClient()

  const [page, setPage] = React.useState(1)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('All Products')
  const limit = 10

  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      await axiosInstance.delete(`/products/delete/${productId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (err) => {
      console.error('Failed to delete product:', err)
    },
    onSettled: () => {
      setDeletingId(null)
    },
  })

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['products', page, limit],
    queryFn: async () => {
      const response = await axiosInstance.get('/products/get-products', {
        params: { page, limit },
      })
      return response.data
    },
    placeholderData: (prev) => prev,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0d0d14] to-[#0f0f1a] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
          <p className="text-gray-400 text-lg">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0d0d14] to-[#0f0f1a] flex items-center justify-center p-6">
        <div className="bg-gray-800/40 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8 max-w-md w-full text-center">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Failed to Load Products</h2>
          <p className="text-gray-400 text-sm">There was an error loading your products. Please try again.</p>
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

  const products = data?.products || []
  const meta = data?.meta
  const total = typeof data?.total === 'number' ? data.total : products.length

  // Filter products based on search and status
  const filteredProducts = products.filter((product: any) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.category?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'All Products' || product.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    const colors = {
      'Active': 'bg-green-500/20 text-green-400 border-green-500/20',
      'Low Stock': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20',
      'Out of Stock': 'bg-red-500/20 text-red-400 border-red-500/20',
      'Inactive': 'bg-gray-500/20 text-gray-400 border-gray-500/20'
    }
    return colors[status as keyof typeof colors] || colors['Active']
  }

  const getStatusIcon = (status: string) => {
    const icons = {
      'Active': <TrendingUp className="w-3 h-3" />,
      'Low Stock': <AlertTriangle className="w-3 h-3" />,
      'Out of Stock': <XCircle className="w-3 h-3" />,
      'Inactive': <Package className="w-3 h-3" />
    }
    return icons[status as keyof typeof icons] || null
  }

  const stats = [
    {
      title: 'Total Products',
      value: total,
      icon: Package,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/10 to-cyan-500/10'
    },
    {
      title: 'Active Products',
      value: products.filter((p: any) => p.status === 'Active').length,
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-500/10 to-emerald-500/10'
    },
    {
      title: 'Low Stock',
      value: products.filter((p: any) => p.stock < 10 && p.stock > 0).length,
      icon: AlertTriangle,
      gradient: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-500/10 to-orange-500/10'
    },
    {
      title: 'Out of Stock',
      value: products.filter((p: any) => p.stock === 0).length,
      icon: XCircle,
      gradient: 'from-red-500 to-pink-500',
      bgGradient: 'from-red-500/10 to-pink-500/10'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0d0d14] to-[#0f0f1a] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
              Manage Products
            </h1>
            <p className="text-gray-400 mt-2 flex items-center gap-2">
              <span>Edit, manage, delete and monitor all your products</span>
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse" />
            </p>
          </div>
          <Link
            href="/dashboard/manage-products/create-product"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/25 w-fit"
          >
            <Plus className="w-4 h-4" />
            Add New Product
          </Link>
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

        {/* Products List */}
        <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition-all duration-300">
          {/* Top Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">All Products</h2>
              <p className="text-gray-400 text-sm mt-1">Manage all listed products from here</p>
            </div>

            <div className="flex gap-3 flex-col sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-gray-700/30 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 w-full sm:w-48 md:w-56"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 bg-gray-700/30 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 cursor-pointer"
              >
                <option>All Products</option>
                <option>Active</option>
                <option>Low Stock</option>
                <option>Out of Stock</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>

          {/* Pagination Info */}
          {meta && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <p className="text-sm text-gray-500">
                Showing <span className="text-gray-300">{((meta.page - 1) * limit) + 1}</span> to{' '}
                <span className="text-gray-300">{Math.min(meta.page * limit, meta.total)}</span> of{' '}
                <span className="text-gray-300">{meta.total}</span> products
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!meta.hasPrev || isLoading}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
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
                  disabled={!meta.hasNext || isLoading}
                  onClick={() => setPage((p) => p + 1)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {filteredProducts.length === 0 ? (
              <div className="col-span-1 xl:col-span-2 text-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <Package className="w-16 h-16 text-gray-600 opacity-30" />
                  <p className="text-gray-400 text-lg">No products found</p>
                  <p className="text-gray-500 text-sm">Try adjusting your search or filter</p>
                  <Link
                    href="/dashboard/manage-products/create-product"
                    className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/25"
                  >
                    <Plus className="w-4 h-4" />
                    Add Your First Product
                  </Link>
                </div>
              </div>
            ) : (
              filteredProducts.map((product: any, index: number) => (
                <div
                  key={index}
                  className="group bg-gray-700/20 border border-gray-700 rounded-2xl p-5 hover:border-gray-600 hover:bg-gray-700/30 transition-all duration-300 hover:shadow-2xl hover:shadow-black/20"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-16 h-16 rounded-2xl bg-gray-700/50 flex items-center justify-center text-3xl border border-gray-700/50 shrink-0">
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover rounded-2xl"
                          />
                        ) : (
                          '📦'
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-400 truncate">{product.category || 'Uncategorized'}</p>

                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <span className="text-lg font-bold text-white">
                            ${Number(product.price || 0).toFixed(2)}
                          </span>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(product.status)}`}>
                            {getStatusIcon(product.status)}
                            {product.status || 'Active'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button className="p-2 rounded-xl bg-gray-700/30 hover:bg-gray-700/50 text-gray-400 hover:text-white transition-all duration-200">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 font-medium">Stock</p>
                      <h3 className={`text-xl font-bold mt-0.5 ${product.stock === 0 ? 'text-red-400' : product.stock < 10 ? 'text-yellow-400' : 'text-white'}`}>
                        {product.stock || 0}
                      </h3>
                    </div>

                    <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 font-medium">Total Sales</p>
                      <h3 className="text-xl font-bold text-white mt-0.5">
                        {product.sales || 0}
                      </h3>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <Link
                      href={`/dashboard/manage-products/edit-product/${product.id}`}
                      className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/20"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit
                    </Link>

                    <button className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gray-700/30 text-white rounded-xl text-sm font-medium hover:bg-gray-700/50 transition-all duration-200 border border-gray-700">
                      <RefreshCw className="w-3.5 h-3.5" />
                      Stock
                    </button>

                    <button
                      type="button"
                      disabled={deleteMutation.isPending && deletingId === String(product.id)}
                      onClick={() => {
                        const ok = window.confirm(
                          'Delete this product? This action can\'t be undone.'
                        )
                        if (!ok) return
                        setDeletingId(String(product.id))
                        deleteMutation.mutate(String(product.id))
                      }}
                      className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        deleteMutation.isPending && deletingId === String(product.id)
                          ? 'bg-red-500/10 text-red-400/50 cursor-not-allowed'
                          : 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                      }`}
                    >
                      {deleteMutation.isPending && deletingId === String(product.id) ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageProductsPage