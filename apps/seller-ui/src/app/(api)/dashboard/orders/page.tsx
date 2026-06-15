'use client'

import { useQuery } from '@tanstack/react-query'
import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance';
import Link from 'next/link';

import React from 'react'

const OrdersPage = () => {

  const [page, setPage] = React.useState(1)
  const limit = 20

  const {
    data,
    isLoading,
    isError,
    error,
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
  console.log('row orders', rawOrders)

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
  

    console.log(orders)
  return (
    <div className='min-h-screen bg-[#f6f7fb] p-6'>

      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8'>

        <div>
          <h1 className='text-4xl font-bold text-black tracking-tight'>
            Orders
          </h1>

          <p className='text-gray-500 mt-2'>
            Track and manage all customer orders.
          </p>
        </div>

        <button className='bg-black text-white px-5 py-3 rounded-2xl font-medium hover:bg-[#111] transition-all duration-200 w-fit'>
          Export Orders
        </button>

      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8'>

        <div className='bg-white border border-gray-200 rounded-[28px] p-6 shadow-sm'>
          <p className='text-gray-500 text-sm'>
            Total Orders
          </p>

          <h2 className='text-3xl font-bold text-black mt-2'>
            {total_orders}
          </h2>
        </div>

        <div className='bg-white border border-gray-200 rounded-[28px] p-6 shadow-sm'>
          <p className='text-gray-500 text-sm'>
            Pending
          </p>

          <h2 className='text-3xl font-bold text-yellow-600 mt-2'>
            {pending_orders}
          </h2>
        </div>

        <div className='bg-white border border-gray-200 rounded-[28px] p-6 shadow-sm'>
          <p className='text-gray-500 text-sm'>
            Delivered
          </p>

          <h2 className='text-3xl font-bold text-green-600 mt-2'>
            { delivered_orders}
          </h2>
        </div>

        <div className='bg-white border border-gray-200 rounded-[28px] p-6 shadow-sm'>
          <p className='text-gray-500 text-sm'>
            Revenue
          </p>

          <h2 className='text-3xl font-bold text-black mt-2'>
            ₹{revenue.toFixed(2)}
          </h2>
        </div>

      </div>

      {/* Orders Table */}
      <div className='bg-white border border-gray-200 rounded-[32px] p-6 shadow-sm'>

        {/* Top */}
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6'>

          <div>
            <h2 className='text-2xl font-bold text-black'>
              Recent Orders
            </h2>

            <p className='text-gray-500 text-sm mt-1'>
              View all recent customer purchases.
            </p>
          </div>

          <div className='flex gap-3 flex-col sm:flex-row'>

            <input
              type='text'
              placeholder='Search orders...'
              className='bg-[#f7f7f7] border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition-all'
            />

            <select className='bg-[#f7f7f7] border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition-all'>
              <option>All Orders</option>
              <option>Pending</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>

          </div>

          {/* Pagination */}
          <div className='flex items-center gap-3'>
            {meta ? (
              <p className='text-sm text-gray-500 hidden md:block'>
                Page {meta.page} of {meta.totalPages} · Total {meta.total}
              </p>
            ) : null}

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

        {/* Table */}
        {isLoading ? (
          <div className='py-16 text-center text-gray-500'>
            Loading orders...
          </div>
        ) : isError ? (
          <div className='py-16 text-center'>
            <p className='text-red-600 font-semibold'>Failed to load orders</p>
            <p className='text-gray-500 mt-2 text-sm'>
              {String((error as any)?.message ?? error)}
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className='py-16 text-center text-gray-500'>
            No orders found yet.
          </div>
        ) : (
          <div className='overflow-x-auto'>

          <table className='w-full min-w-[900px]'>

            <thead>
              <tr className='border-b border-gray-200 text-left'>

                <th className='pb-4 text-sm font-semibold text-gray-500'>
                  Order ID
                </th>

                <th className='pb-4 text-sm font-semibold text-gray-500'>
                  Customer
                </th>

                <th className='pb-4 text-sm font-semibold text-gray-500'>
                  Product
                </th>

                <th className='pb-4 text-sm font-semibold text-gray-500'>
                  Amount
                </th>

                <th className='pb-4 text-sm font-semibold text-gray-500'>
                  Payment
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

              {orders.map((order, index) => (
                <tr
                  key={index}
                  className='border-b border-gray-100 hover:bg-[#fafafa] transition-all'
                >

                  <td className='py-5 font-semibold text-black'>
                    {order.id}
                  </td>

                  <td className='py-5'>
                    <div>
                      <h3 className='font-medium text-black'>
                        {order.customer}
                      </h3>
                      {order.customerEmail ? (
                        <p className='text-xs text-gray-400 mt-1'>
                          {order.customerEmail}
                        </p>
                      ) : null}
                    </div>
                  </td>

                  <td className='py-5 text-gray-600'>
                    {order.product}
                  </td>

                  <td className='py-5 font-semibold text-black'>
                    {order.amount}
                  </td>

                  <td className='py-5'>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.payment === 'PAID'
                          ? 'bg-green-100 text-green-700'
                          : order.payment === 'REFUNDED'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {order.payment}
                    </span>
                  </td>

                  <td className='py-5'>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'DELIVERED'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-700'
                          : order.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className='py-5 text-gray-500'>
                    {order.date}
                  </td>

                  <td className='py-5'>
                    <div className='flex justify-end gap-3'>

                      <button className='bg-[#f3f4f6] text-black px-4 py-2 rounded-xl hover:bg-[#e5e7eb] transition-all duration-200'>
                        View
                      </button>
                        <Link href={`/dashboard/orders/${order.id}`}>
                          <button className='bg-black text-white px-4 py-2 rounded-xl hover:bg-[#111] transition-all duration-200'>
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

      </div>

    </div>
  )
}

export default OrdersPage