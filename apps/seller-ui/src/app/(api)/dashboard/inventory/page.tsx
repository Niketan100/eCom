'use client'
import React from 'react'
import { useMutation } from '@tanstack/react-query'
import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance'
import {  
  Plus, 
  Search, 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  XCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit
} from 'lucide-react'
import Link from 'next/link'

const InventoryPage = () => {
  const [page, setPage] = React.useState(1)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('All Products')
  const limit = 4

  const getInventoryMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.get('/products/get-products', {
        params: { page, limit },
      })
      return res.data
    },
    onSuccess: (data) => {
      console.log('Inventory Data:', data)
    },
    onError: (error) => {
      console.error('Failed to fetch inventory:', error)
    }
  })

  let inventory: any[] = []
  const total_products = getInventoryMutation.data?.count || 0
  const meta = getInventoryMutation.data?.meta

  if (getInventoryMutation.isSuccess) {
    inventory = getInventoryMutation.data.products.map((product: any) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      price: `$${product.price.toFixed(2)}`,
      stock: product.stock,
      status: product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'
    }))
  }

  React.useEffect(() => {
    getInventoryMutation.mutate()
  }, [page])

  // Filter inventory based on search and status
  const filteredInventory = inventory.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'All Products' || product.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    const colors = {
      'In Stock': 'bg-green-500/20 text-green-400 border-green-500/20',
      'Low Stock': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20',
      'Out of Stock': 'bg-red-500/20 text-red-400 border-red-500/20'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-500/20 text-gray-400 border-gray-500/20'
  }

  const getStatusIcon = (status: string) => {
    const icons = {
      'In Stock': <TrendingUp className="w-3.5 h-3.5" />,
      'Low Stock': <AlertTriangle className="w-3.5 h-3.5" />,
      'Out of Stock': <XCircle className="w-3.5 h-3.5" />
    }
    return icons[status as keyof typeof icons] || null
  }

  const stats = [
    {
      title: 'Total Products',
      value: total_products,
      icon: Package,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/10 to-cyan-500/10'
    },
    {
      title: 'In Stock',
      value: total_products - inventory.filter(product => product.status === 'Low Stock' || product.status === 'Out of Stock').length,
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-500/10 to-emerald-500/10'
    },
    {
      title: 'Low Stock',
      value: inventory.filter(product => product.status === 'Low Stock').length,
      icon: AlertTriangle,
      gradient: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-500/10 to-orange-500/10'
    },
    {
      title: 'Out of Stock',
      value: inventory.filter(product => product.status === 'Out of Stock').length,
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
              Inventory
            </h1>
            <p className="text-gray-400 mt-2 flex items-center gap-2">
              <span>Manage stock levels and monitor product availability</span>
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse" />
            </p>
          </div>
          <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/25 w-fit">
            <Plus className="w-4 h-4" />
            Add Product
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

        {/* Inventory Table */}
        <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition-all duration-300">
          {/* Top Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Product Inventory</h2>
              <p className="text-gray-400 text-sm mt-1">Track all products and available stock</p>
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
                <option>In Stock</option>
                <option>Low Stock</option>
                <option>Out of Stock</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead>
                <tr className="border-b border-gray-700/50 text-left">
                  <th className="pb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Product ID
                  </th>
                  <th className="pb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="pb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="pb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="pb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="pb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="pb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {getInventoryMutation.isPending ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center">
                      <div className="flex items-center justify-center gap-3 text-gray-400">
                        <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                        <span>Loading inventory...</span>
                      </div>
                    </td>
                  </tr>
                ) : getInventoryMutation.isError ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center">
                      <div className="flex items-center justify-center gap-2 text-red-400">
                        <XCircle className="w-5 h-5" />
                        <span>Failed to load inventory</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredInventory.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center">
                      <div className="flex flex-col items-center gap-2 text-gray-500">
                        <Package className="w-12 h-12 opacity-20" />
                        <p className="text-sm">No products found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredInventory.map((product, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-700/30 hover:bg-white/5 transition-all duration-200 group"
                    >
                      <td className="py-4 font-mono text-sm text-gray-300">
                        #{product.id.slice(0, 8)}
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gray-700/30 flex items-center justify-center text-2xl border border-gray-700/50">
                            📦
                          </div>
                          <div>
                            <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors">
                              {product.name}
                            </h3>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-gray-400">
                        {product.category}
                      </td>
                      <td className="py-4 font-semibold text-white">
                        {product.price}
                      </td>
                      <td className="py-4 text-gray-300">
                        {product.stock}
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(product.status)}`}>
                          {getStatusIcon(product.status)}
                          {product.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/dashboard/manage-products/edit-product/${product.id}`}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl text-xs font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/20">
                            Update Stock
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-700/30 mt-4">
            <p className="text-sm text-gray-500">
              {meta ? (
                <>
                  Showing <span className="text-gray-300">{((meta.page - 1) * limit) + 1}</span> to{' '}
                  <span className="text-gray-300">{Math.min(meta.page * limit, meta.total)}</span> of{' '}
                  <span className="text-gray-300">{meta.total}</span> products
                </>
              ) : null}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={getInventoryMutation.isPending || !meta?.hasPrev}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-700 bg-gray-700/30 text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20 text-white font-medium min-w-[40px] text-center">
                {meta?.page || 1}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                disabled={getInventoryMutation.isPending || !meta?.hasNext}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InventoryPage