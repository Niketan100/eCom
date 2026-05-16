'use client'

import React from 'react'

const payments = [
  {
    id: '#PAY-3021',
    customer: 'Rahul Sharma',
    method: 'UPI',
    amount: '₹2,499',
    status: 'Completed',
    order: '#ORD-1024',
    date: 'Today',
  },
  {
    id: '#PAY-3022',
    customer: 'Priya Kapoor',
    method: 'Credit Card',
    amount: '₹1,299',
    status: 'Pending',
    order: '#ORD-1025',
    date: 'Yesterday',
  },
  {
    id: '#PAY-3023',
    customer: 'Aman Verma',
    method: 'Net Banking',
    amount: '₹4,999',
    status: 'Completed',
    order: '#ORD-1026',
    date: '2 days ago',
  },
  {
    id: '#PAY-3024',
    customer: 'Neha Thakur',
    method: 'Wallet',
    amount: '₹1,899',
    status: 'Refunded',
    order: '#ORD-1027',
    date: '4 days ago',
  },
]

const PaymentsPage = () => {
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
            ₹48,320
          </h2>
        </div>

        <div className='bg-white border border-gray-200 rounded-[28px] p-6 shadow-sm'>
          <p className='text-sm text-gray-500'>
            Successful Payments
          </p>

          <h2 className='text-3xl font-bold text-green-600 mt-2'>
            268
          </h2>
        </div>

        <div className='bg-white border border-gray-200 rounded-[28px] p-6 shadow-sm'>
          <p className='text-sm text-gray-500'>
            Pending Payments
          </p>

          <h2 className='text-3xl font-bold text-yellow-600 mt-2'>
            18
          </h2>
        </div>

        <div className='bg-white border border-gray-200 rounded-[28px] p-6 shadow-sm'>
          <p className='text-sm text-gray-500'>
            Refunds
          </p>

          <h2 className='text-3xl font-bold text-red-600 mt-2'>
            ₹4,200
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
              className='bg-[#f7f7f7] border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition-all'
            />

            <select className='bg-[#f7f7f7] border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition-all'>
              <option>All Transactions</option>
              <option>Completed</option>
              <option>Pending</option>
              <option>Refunded</option>
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

              {payments.map((payment, index) => (
                <tr
                  key={index}
                  className='border-b border-gray-100 hover:bg-[#fafafa] transition-all'
                >

                  <td className='py-5 font-semibold text-black'>
                    {payment.id}
                  </td>

                  <td className='py-5'>
                    <h3 className='font-medium text-black'>
                      {payment.customer}
                    </h3>
                  </td>

                  <td className='py-5 text-gray-600'>
                    {payment.order}
                  </td>

                  <td className='py-5 text-gray-600'>
                    {payment.method}
                  </td>

                  <td className='py-5 font-semibold text-black'>
                    {payment.amount}
                  </td>

                  <td className='py-5'>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        payment.status === 'Completed'
                          ? 'bg-green-100 text-green-700'
                          : payment.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>

                  <td className='py-5 text-gray-500'>
                    {payment.date}
                  </td>

                  <td className='py-5'>
                    <div className='flex justify-end gap-3'>

                      <button className='bg-[#f3f4f6] text-black px-4 py-2 rounded-xl hover:bg-[#e5e7eb] transition-all duration-200'>
                        Receipt
                      </button>

                      <button className='bg-black text-white px-4 py-2 rounded-xl hover:bg-[#111] transition-all duration-200'>
                        Details
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

export default PaymentsPage