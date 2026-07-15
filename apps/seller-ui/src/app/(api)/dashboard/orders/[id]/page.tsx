'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance'
import Link from 'next/link'
import {
  ArrowLeft,
  Package,
  User,
  Mail,
  MapPin,
  CreditCard,
  Calendar,
  DollarSign,
  ShoppingBag,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  Loader2,
  ChevronRight,
  Edit
} from 'lucide-react'

type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

type SellerOrder = {
  id: string
  status: OrderStatus
  quantity: number
  totalPrice: number
  shippingAddress: string
  createdAt: string
  updatedAt: string
  product: {
    id: string
    name: string
    slug: string
    price: number
    discountedPrice?: number | null
  }
  user: {
    id: string
    name: string
    email: string
  }
  payment?: {
    id: string
    method?: string | null
    status?: string | null
    amount?: number | null
    createdAt?: string
  } | null
}

const getStatusConfig = (status: OrderStatus) => {
  const configs: Record<OrderStatus, { color: string; bg: string; border: string; icon: React.ReactNode }> = {
    'PENDING': {
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
      icon: <Clock className="w-4 h-4" />
    },
    'CONFIRMED': {
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      icon: <CheckCircle className="w-4 h-4" />
    },
    'SHIPPED': {
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      icon: <Truck className="w-4 h-4" />
    },
    'DELIVERED': {
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      icon: <CheckCircle className="w-4 h-4" />
    },
    'CANCELLED': {
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      icon: <XCircle className="w-4 h-4" />
    }
  }
  return configs[status] || configs['PENDING']
}

const getPaymentConfig = (status: string | null | undefined) => {
  const configs: Record<string, { color: string; bg: string; border: string }> = {
    'PAID': {
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20'
    },
    'PENDING': {
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20'
    },
    'FAILED': {
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20'
    },
    'REFUNDED': {
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20'
    }
  }
  return configs[status || 'PENDING'] || configs['PENDING']
}

const StatusPill = ({ status }: { status: OrderStatus }) => {
  const config = getStatusConfig(status)
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.color} ${config.bg} ${config.border}`}>
      {config.icon}
      {status}
    </span>
  )
}

const InfoCard = ({ icon: Icon, label, value, className = '' }: any) => (
  <div className={`bg-gray-700/20 border border-gray-700 rounded-xl p-4 ${className}`}>
    <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
      <Icon className="w-3.5 h-3.5" />
      {label}
    </div>
    <p className="text-white font-semibold mt-1.5">{value || '—'}</p>
  </div>
)

export default function ProcessOrderPage() {
  const params = useParams<{ id: string }>()
  const orderId = String(params?.id || '')
  const router = useRouter()
  const queryClient = useQueryClient()

  const orderQuery = useQuery({
    queryKey: ['seller-order', orderId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/products/orders/${orderId}`)
      return res.data as { success: boolean; order: SellerOrder }
    },
    enabled: Boolean(orderId),
  })

  const order = orderQuery.data?.order;

  const updateStatusMutation = useMutation({
    mutationFn: async (status: OrderStatus) => {
      const res = await axiosInstance.patch(`/products/orders/${orderId}/status`, { status })
      return res.data as { success: boolean; order: SellerOrder }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['seller-order', orderId] })
      await queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })

  const possibleNext: Record<OrderStatus, OrderStatus[]> = {
    PENDING: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['SHIPPED', 'CANCELLED'],
    SHIPPED: ['DELIVERED'],
    DELIVERED: [],
    CANCELLED: [],
  }

  

  if (orderQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0d0d14] to-[#0f0f1a] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
          <p className="text-gray-400 text-lg">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (orderQuery.isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0d0d14] to-[#0f0f1a] flex items-center justify-center p-6">
        <div className="bg-gray-800/40 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8 max-w-md w-full text-center">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Failed to Load Order</h2>
          <p className="text-gray-400 text-sm">There was an error loading this order. Please try again.</p>
          <button 
            onClick={() => orderQuery.refetch()}
            className="mt-6 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/25"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0d0d14] to-[#0f0f1a] flex items-center justify-center p-6">
        <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700 rounded-2xl p-8 max-w-md w-full text-center">
          <Package className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Order Not Found</h2>
          <p className="text-gray-400 text-sm">The order you're looking for doesn't exist or has been removed.</p>
          <Link href="/dashboard/orders" className="inline-flex items-center gap-2 mt-6 text-blue-400 hover:text-blue-300 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
        </div>
      </div>
    )
  }
  const isShippedOrDelivered = order.status === 'SHIPPED' || order.status === 'DELIVERED';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0d0d14] to-[#0f0f1a] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <Link 
              href="/dashboard/orders" 
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-2 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Orders
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
              Process Order
            </h1>
            <p className="text-gray-400 mt-2 flex items-center gap-2">
              <span>Order ID:</span>
              <span className="font-mono text-blue-400 font-medium">{orderId}</span>
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse" />
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-700 bg-gray-700/30 text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <Link
              href="/dashboard/orders"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/25"
            >
              <ShoppingBag className="w-4 h-4" />
              Orders
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition-all duration-300">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">Order Summary</h2>
                  <p className="text-gray-400 text-sm mt-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Placed: {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <StatusPill status={order.status} />
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard
                  icon={Package}
                  label="Product"
                  value={order.product?.name}
                />
                <InfoCard
                  icon={ShoppingBag}
                  label="Quantity"
                  value={`${order.quantity} items`}
                />
                <InfoCard
                  icon={DollarSign}
                  label="Total Amount"
                  value={`₹${order.totalPrice.toFixed(2)}`}
                  className="md:col-span-2"
                />
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition-all duration-300">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-blue-400" />
                Customer
              </h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard
                  icon={User}
                  label="Name"
                  value={order.user?.name}
                />
                <InfoCard
                  icon={Mail}
                  label="Email"
                  value={order.user?.email}
                />
              </div>

              <div className="mt-4">
                <InfoCard
                  icon={MapPin}
                  label="Shipping Address"
                  value={order.shippingAddress}
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* Payment Info */}
            <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition-all duration-300">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-400" />
                Payment
              </h2>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
                  <span className="text-sm text-gray-400">Status</span>
                  <span className={`text-sm font-semibold ${getPaymentConfig(order.payment?.status).color}`}>
                    {String(order.payment?.status ?? 'PENDING').toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
                  <span className="text-sm text-gray-400">Method</span>
                  <span className="text-sm font-semibold text-white">
                    {String(order.payment?.method ?? '—').toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-400">Amount</span>
                  <span className="text-sm font-semibold text-white">
                    ₹{Number(order.payment?.amount || order.totalPrice).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition-all duration-300">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Edit className="w-5 h-5 text-blue-400" />
                Actions
              </h2>
              <p className="text-gray-400 text-sm mt-1">Update order status</p>

              <div className="mt-4 space-y-2">
                {possibleNext[order.status].length === 0 ? (
                  <div className="text-center py-6 text-gray-400 text-sm bg-gray-700/20 rounded-xl">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
                    No further actions available
                  </div>
                ) : (
                  possibleNext[order.status].map((s) => {
                    const isDanger = s === 'CANCELLED'
                    return (
                      <button
                        key={s}
                        onClick={() => updateStatusMutation.mutate(s)}
                        disabled={updateStatusMutation.isPending}
                        className={`
                          w-full px-4 py-3 rounded-xl font-medium
                          transition-all duration-200 flex items-center justify-center gap-2
                          ${isDanger 
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/30' 
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25'
                          }
                          disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                      >
                        {updateStatusMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            {isDanger ? <XCircle className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            Mark as {s}
                          </>
                        )}
                      </button>
                    )
                  })
                )}
              </div>

              {updateStatusMutation.isError && (
                <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  Failed to update order status
                </div>
              )}

              {updateStatusMutation.isSuccess && (
                <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-sm text-green-400 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Order status updated successfully!
                </div>
              )}
            </div>

            {/* Order Timeline */}
            <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition-all duration-300">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                Timeline
              </h2>
              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-green-400" />
                  <div>
                    <p className="text-sm text-white">Order Placed</p>
                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                {order.status !== 'PENDING' && order.status !== 'CANCELLED' && (
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 mt-1.5 rounded-full ${order.status === 'CONFIRMED' ? 'bg-yellow-400' : 'bg-green-400'}`} />
                    <div>
                      <p className="text-sm text-white">Confirmed</p>
                      <p className="text-xs text-gray-500">{new Date(order.updatedAt).toLocaleString()}</p>
                    </div>
                  </div>
                )}
                

                {isShippedOrDelivered && (
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 mt-1.5 rounded-full ${order.status === 'SHIPPED' ? 'bg-blue-400' : 'bg-green-400'}`} />
                    <div>
                      <p className="text-sm text-white">
                        {order.status === 'SHIPPED' ? 'Shipped' : 'Delivered'}
                      </p>
                      <p className="text-xs text-gray-500">{new Date(order.updatedAt).toLocaleString()}</p>
                    </div>
                  </div>
                )}
                {order.status === 'DELIVERED' && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-green-400" />
                    <div>
                      <p className="text-sm text-white">Delivered</p>
                      <p className="text-xs text-gray-500">{new Date(order.updatedAt).toLocaleString()}</p>
                    </div>
                  </div>
                )}
                {order.status === 'CANCELLED' && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-red-400" />
                    <div>
                      <p className="text-sm text-white">Cancelled</p>
                      <p className="text-xs text-gray-500">{new Date(order.updatedAt).toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}