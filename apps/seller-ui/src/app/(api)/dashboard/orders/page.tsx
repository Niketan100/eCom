'use client'

import { useMutation } from '@tanstack/react-query';
import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance';

import React from 'react'

const OrdersPage = () => {

  const orders :any[] = [];

  const getOrders  = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.get('/products/get-orders')
      return res.data
    },
    onSuccess: (data) => {
      console.log('Orders Data:', data)
    },
    onError: (error) => {
      console.error('Failed to fetch orders:', error)
    }
  })

  if(getOrders.isSuccess){
    orders.push(...getOrders.data.orders.map((order: any) => ({
      id: order.id,
      customer: order.user.name,
      product: order.product.name,
      amount: `₹${order.product.price.toFixed(2)}`,
      payment: order.paymentStatus,
      status: order.status,
      date: new Date(order.createdAt).toLocaleDateString()
    })))
  }

  React.useEffect(() => {
    getOrders.mutate();
  }, [])

  console.log('Orders:', orders)

  const total_orders = getOrders.data?.count || 0;
  const pending_orders = getOrders.data?.orders.filter((order: any) => order.status === 'PENDING').length || 0;
  const delivered_orders = getOrders.data?.orders.filter((order: any) => order.status === 'DELIVERED').length || 0;
  const delivered_orders_data = getOrders.data?.orders.filter((order: any) => order.status === 'DELIVERED') || [];
  const revenue = delivered_orders_data.reduce((acc: number, order: any) => acc + (order.product?.price || 0), 0) || 0;
  


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

        </div>

        {/* Table */}
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
                        order.payment === 'Paid'
                          ? 'bg-green-100 text-green-700'
                          : order.payment === 'Refunded'
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
                        order.status === 'Delivered'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : order.status === 'Cancelled'
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

                      <button className='bg-black text-white px-4 py-2 rounded-xl hover:bg-[#111] transition-all duration-200'>
                        Update
                      </button>

                    </div>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}

export default OrdersPage