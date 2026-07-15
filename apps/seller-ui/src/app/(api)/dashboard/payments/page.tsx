'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import {
  DollarSign,
  CheckCircle,
  Clock,
  RefreshCw,
  Search,
  Filter,
  Download,
  Eye,
  FileText,
  ChevronLeft,
  ChevronRight,
  Loader2,
  XCircle,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Calendar
} from 'lucide-react'

import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance'

type SellerPayment = {
  id: string
  orderId: string
  amount: number
  paymentMethod?: string | null
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
  createdAt: string
  order?: {
    id: string
    status: string
    user?: { id: string; name: string; email: string }
    product?: { id: string; name: string; price: number }
  }
}

type PaymentsResponse = {
  success: boolean
  count: number
  total?: number
  meta?: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasPrev: boolean
    hasNext: boolean
  }
  payments: SellerPayment[]
}

const PaymentsPage = () => {
  const router = useRouter()
  const [search, setSearch] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<'ALL' | SellerPayment['status']>('ALL')
  const [page, setPage] = React.useState(1)
  const [selectedPayment, setSelectedPayment] = React.useState<string | null>(null)
  const limit = 20

  const { data, isLoading, isError, refetch } = useQuery<PaymentsResponse>({
    queryKey: ['seller-payments', page, limit],
    queryFn: async () => {
      const res = await axiosInstance.get('/products/payments/my', {
        params: { page, limit },
      })
      return res.data
    },
  })

  const payments = data?.payments ?? []
  const meta = data?.meta

  const filteredPayments = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    return payments.filter((p) => {
      if (statusFilter !== 'ALL' && p.status !== statusFilter) return false

      if (!q) return true

      const customer = p.order?.user?.name ?? ''
      const email = p.order?.user?.email ?? ''
      const productName = p.order?.product?.name ?? ''

      return (
        p.id.toLowerCase().includes(q) ||
        p.orderId.toLowerCase().includes(q) ||
        customer.toLowerCase().includes(q) ||
        email.toLowerCase().includes(q) ||
        productName.toLowerCase().includes(q)
      )
    })
  }, [payments, search, statusFilter])

  const stats = React.useMemo(() => {
    const totalRevenue = payments
      .filter((p) => p.status === 'PAID')
      .reduce((acc, p) => acc + (p.amount || 0), 0)
    const successfulCount = payments.filter((p) => p.status === 'PAID').length
    const pendingCount = payments.filter((p) => p.status === 'PENDING').length
    const failedCount = payments.filter((p) => p.status === 'FAILED').length
    const refundsAmount = payments
      .filter((p) => p.status === 'REFUNDED')
      .reduce((acc, p) => acc + (p.amount || 0), 0)

    return {
      totalRevenue,
      successfulCount,
      pendingCount,
      failedCount,
      refundsAmount,
    }
  }, [payments])

  const getStatusColor = (status: string) => {
    const colors = {
      'PAID': 'bg-green-500/20 text-green-400 border-green-500/20',
      'PENDING': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20',
      'FAILED': 'bg-red-500/20 text-red-400 border-red-500/20',
      'REFUNDED': 'bg-purple-500/20 text-purple-400 border-purple-500/20'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-500/20 text-gray-400 border-gray-500/20'
  }

  const getStatusIcon = (status: string) => {
    const icons = {
      'PAID': <CheckCircle className="w-3 h-3" />,
      'PENDING': <Clock className="w-3 h-3" />,
      'FAILED': <XCircle className="w-3 h-3" />,
      'REFUNDED': <RefreshCw className="w-3 h-3" />
    }
    return icons[status as keyof typeof icons] || null
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'PAID': 'Paid',
      'PENDING': 'Pending',
      'FAILED': 'Failed',
      'REFUNDED': 'Refunded'
    }
    return labels[status] || status
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/10 to-cyan-500/10'
    },
    {
      title: 'Successful Payments',
      value: stats.successfulCount,
      icon: CheckCircle,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-500/10 to-emerald-500/10'
    },
    {
      title: 'Pending Payments',
      value: stats.pendingCount,
      icon: Clock,
      gradient: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-500/10 to-orange-500/10'
    },
    {
      title: 'Refunded Amount',
      value: `₹${stats.refundsAmount.toLocaleString()}`,
      icon: RefreshCw,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-500/10 to-pink-500/10'
    }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0d0d14] to-[#0f0f1a] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
          <p className="text-gray-400 text-lg">Loading payments...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0d0d14] to-[#0f0f1a] flex items-center justify-center p-6">
        <div className="bg-gray-800/40 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8 max-w-md w-full text-center">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Failed to Load Payments</h2>
          <p className="text-gray-400 text-sm">There was an error loading your payments. Please try again.</p>
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
              Payments
            </h1>
            <p className="text-gray-400 mt-2 flex items-center gap-2">
              <span>Track all payment transactions and revenue activity</span>
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse" />
            </p>
          </div>
          <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/25 w-fit">
            <Download className="w-4 h-4" />
            Download Report
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          {statCards.map((stat, index) => (
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

        {/* Payments Table */}
        <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition-all duration-300">
          {/* Top Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Recent Transactions</h2>
              <p className="text-gray-400 text-sm mt-1">Monitor recent customer payments and transaction history</p>
            </div>

            <div className="flex gap-3 flex-col sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search payments..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-gray-700/30 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 w-full sm:w-48 md:w-56"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-2.5 bg-gray-700/30 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 cursor-pointer"
              >
                <option value="ALL">All Status</option>
                <option value="PAID">Paid</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
                <option value="REFUNDED">Refunded</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead>
                <tr className="border-b border-gray-700/50 text-left">
                  <th className="pb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Payment ID
                  </th>
                  <th className="pb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="pb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="pb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="pb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Amount
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
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <CreditCard className="w-16 h-16 text-gray-600 opacity-30" />
                        <p className="text-gray-400 text-lg">No payments found</p>
                        <p className="text-gray-500 text-sm">Try adjusting your search or filter</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-700/30 hover:bg-white/5 transition-all duration-200 group"
                    >
                      <td className="py-4 font-mono text-sm text-gray-300">
                        #{payment.id.slice(0, 8)}
                      </td>
                      <td className="py-4">
                        <div>
                          <p className="font-medium text-white group-hover:text-blue-400 transition-colors">
                            {payment.order?.user?.name ?? 'Guest Customer'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {payment.order?.user?.email ?? 'No email'}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 font-mono text-sm text-gray-400">
                        #{payment.orderId.slice(0, 8)}
                      </td>
                      <td className="py-4">
                        <span className="inline-flex items-center gap-1.5 text-sm text-gray-300">
                          <CreditCard className="w-3.5 h-3.5 text-gray-500" />
                          {payment.paymentMethod ?? 'COD'}
                        </span>
                      </td>
                      <td className="py-4 font-bold text-white">
                        ₹{Number(payment.amount || 0).toLocaleString()}
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(payment.status)}`}>
                          {getStatusIcon(payment.status)}
                          {getStatusLabel(payment.status)}
                        </span>
                      </td>
                      <td className="py-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-500" />
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const url = `/dashboard/payments/${payment.id}/receipt`
                              window.open(url, '_blank', 'noopener,noreferrer')
                            }}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-700/30 text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-200 text-sm"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            Receipt
                          </button>
                          <button
                            type="button"
                            onClick={() => router.push(`/dashboard/payments/${payment.id}`)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm shadow-lg shadow-blue-500/20"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Details
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
                  <span className="text-gray-300">{meta.total}</span> transactions
                </>
              ) : (
                <>Showing {payments.length} transactions</>
              )}
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
                {meta?.page || 1}
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
        </div>
      </div>
    </div>
  )
}

export default PaymentsPage