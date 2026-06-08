'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

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
  const limit = 20

  const { data, isLoading, isError } = useQuery<PaymentsResponse>({
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
    const refundsAmount = payments
      .filter((p) => p.status === 'REFUNDED')
      .reduce((acc, p) => acc + (p.amount || 0), 0)

    return {
      totalRevenue,
      successfulCount,
      pendingCount,
      refundsAmount,
    }
  }, [payments])

  return (
    <div className='min-h-screen bg-[#f6f7fb] p-6'>

      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8'>

        <div>
          <h1 className='text-4xl font-bold tracking-tight text-black'>
            Payments
          </h1>

          <p className='text-gray-500 mt-2'>
            Track all payment transactions and revenue activity.
          </p>
        </div>

        <button className='bg-black text-white px-5 py-3 rounded-2xl font-medium hover:bg-[#111] transition-all duration-200 w-fit'>
          Download Report
        </button>

      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8'>

        <div className='bg-white border border-gray-200 rounded-[28px] p-6 shadow-sm'>
          <p className='text-sm text-gray-500'>
            Total Revenue
          </p>

          <h2 className='text-3xl font-bold text-black mt-2'>
            ₹{stats.totalRevenue.toLocaleString()}
          </h2>
        </div>

        <div className='bg-white border border-gray-200 rounded-[28px] p-6 shadow-sm'>
          <p className='text-sm text-gray-500'>
            Successful Payments
          </p>

          <h2 className='text-3xl font-bold text-green-600 mt-2'>
            {stats.successfulCount}
          </h2>
        </div>

        <div className='bg-white border border-gray-200 rounded-[28px] p-6 shadow-sm'>
          <p className='text-sm text-gray-500'>
            Pending Payments
          </p>

          <h2 className='text-3xl font-bold text-yellow-600 mt-2'>
            {stats.pendingCount}
          </h2>
        </div>

        <div className='bg-white border border-gray-200 rounded-[28px] p-6 shadow-sm'>
          <p className='text-sm text-gray-500'>
            Refunds
          </p>

          <h2 className='text-3xl font-bold text-red-600 mt-2'>
            ₹{stats.refundsAmount.toLocaleString()}
          </h2>
        </div>

      </div>

      {/* Transactions */}
      <div className='bg-white border border-gray-200 rounded-[32px] p-6 shadow-sm'>

        {/* Top */}
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6'>

          <div>
            <h2 className='text-2xl font-bold text-black'>
              Recent Transactions
            </h2>

            <p className='text-sm text-gray-500 mt-1'>
              Monitor recent customer payments and transaction history.
            </p>
          </div>

          <div className='flex gap-3 flex-col sm:flex-row'>

            <input
              type='text'
              placeholder='Search payments...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='bg-[#f7f7f7] border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition-all'
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className='bg-[#f7f7f7] border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition-all'
            >
              <option value='ALL'>All Transactions</option>
              <option value='PAID'>Paid</option>
              <option value='PENDING'>Pending</option>
              <option value='FAILED'>Failed</option>
              <option value='REFUNDED'>Refunded</option>
            </select>

          </div>

        </div>

        {/* Table */}
        <div className='overflow-x-auto'>

          <table className='w-full min-w-[950px]'>

            <thead>
              <tr className='border-b border-gray-200 text-left'>

                <th className='pb-4 text-sm font-semibold text-gray-500'>
                  Payment ID
                </th>

                <th className='pb-4 text-sm font-semibold text-gray-500'>
                  Customer
                </th>

                <th className='pb-4 text-sm font-semibold text-gray-500'>
                  Order ID
                </th>

                <th className='pb-4 text-sm font-semibold text-gray-500'>
                  Method
                </th>

                <th className='pb-4 text-sm font-semibold text-gray-500'>
                  Amount
                </th>

                <th className='pb-4 text-sm font-semibold text-gray-500'>
                  Status
                </th>

                <th className='pb-4 text-sm font-semibold text-gray-500'>
                  Date
                </th>

                <th className='pb-4 text-sm font-semibold text-gray-500 text-right'>
                  Actions
                </th>

              </tr>
            </thead>

            <tbody>

              {isLoading ? (
                <tr>
                  <td colSpan={8} className='py-8 text-center text-gray-500'>
                    Loading payments...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={8} className='py-8 text-center text-red-600'>
                    Failed to load payments.
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className='py-8 text-center text-gray-500'>
                    No payments found.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment, index) => (
                <tr
                  key={index}
                  className='border-b border-gray-100 hover:bg-[#fafafa] transition-all'
                >

                  <td className='py-5 font-semibold text-black'>
                    {payment.id}
                  </td>

                  <td className='py-5'>
                    <h3 className='font-medium text-black'>
                      {payment.order?.user?.name ?? 'Customer'}
                    </h3>
                  </td>

                  <td className='py-5 text-gray-600'>
                    {payment.orderId}
                  </td>

                  <td className='py-5 text-gray-600'>
                    {payment.paymentMethod ?? 'COD'}
                  </td>

                  <td className='py-5 font-semibold text-black'>
                    ₹{Number(payment.amount || 0).toLocaleString()}
                  </td>

                  <td className='py-5'>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        payment.status === 'PAID'
                          ? 'bg-green-100 text-green-700'
                          : payment.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-700'
                          : payment.status === 'REFUNDED'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>

                  <td className='py-5 text-gray-500'>
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>

                  <td className='py-5'>
                    <div className='flex justify-end gap-3'>
                      <button
                        type='button'
                        onClick={() => {
                          const url = `/dashboard/payments/${payment.id}/receipt`
                          window.open(url, '_blank', 'noopener,noreferrer')
                        }}
                        className='bg-[#f3f4f6] text-black px-4 py-2 rounded-xl hover:bg-[#e5e7eb] transition-all duration-200'
                      >
                        Receipt
                      </button>

                      <button
                        type='button'
                        onClick={() => router.push(`/dashboard/payments/${payment.id}`)}
                        className='bg-black text-white px-4 py-2 rounded-xl hover:bg-[#111] transition-all duration-200'
                      >
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
        <div className='flex items-center justify-between pt-6'>
          <p className='text-sm text-gray-500'>
            {meta ? (
              <>
                Page {meta.page} of {meta.totalPages} · Total {meta.total}
              </>
            ) : (
              <>
                Showing {payments.length}
              </>
            )}
          </p>

          <div className='flex items-center gap-3'>
            <button
              type='button'
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={isLoading || !meta?.hasPrev}
              className='px-4 py-2 rounded-xl border border-gray-200 bg-white text-black disabled:opacity-50'
            >
              Prev
            </button>
            <button
              type='button'
              onClick={() => setPage((p) => p + 1)}
              disabled={isLoading || !meta?.hasNext}
              className='px-4 py-2 rounded-xl bg-black text-white disabled:opacity-50'
            >
              Next
            </button>
          </div>
        </div>

      </div>

    </div>
  )
}

export default PaymentsPage