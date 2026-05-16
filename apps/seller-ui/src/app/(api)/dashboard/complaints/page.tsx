'use client'

import React from 'react'

const complaints = [
  {
    id: '#CMP1021',
    customer: 'Rahul Sharma',
    subject: 'Received damaged product',
    message:
      'The package arrived damaged and the product inside was broken.',
    status: 'Pending',
    date: '2 hours ago',
  },
  {
    id: '#CMP1022',
    customer: 'Priya Kapoor',
    subject: 'Refund not received',
    message:
      'I cancelled the order 5 days ago but still did not receive refund.',
    status: 'Resolved',
    date: 'Yesterday',
  },
  {
    id: '#CMP1023',
    customer: 'Aman Verma',
    subject: 'Late delivery issue',
    message:
      'The delivery date has already passed and order is still not delivered.',
    status: 'In Review',
    date: '3 days ago',
  },
]

const ComplaintsPage = () => {
  return (
    <div className='min-h-screen bg-[#f6f7fb] p-6'>

      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8'>

        <div>
          <h1 className='text-4xl font-bold text-black tracking-tight'>
            Complaints
          </h1>

          <p className='text-gray-500 mt-2'>
            Manage customer complaints and support requests.
          </p>
        </div>

        <button className='bg-black text-white px-5 py-3 rounded-2xl font-medium hover:bg-[#111] transition-all duration-200 w-fit'>
          Support Settings
        </button>

      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8'>

        <div className='bg-white border border-gray-200 rounded-[28px] p-6 shadow-sm'>
          <p className='text-gray-500 text-sm'>
            Total Complaints
          </p>

          <h2 className='text-3xl font-bold text-black mt-2'>
            124
          </h2>
        </div>

        <div className='bg-white border border-gray-200 rounded-[28px] p-6 shadow-sm'>
          <p className='text-gray-500 text-sm'>
            Pending
          </p>

          <h2 className='text-3xl font-bold text-yellow-600 mt-2'>
            18
          </h2>
        </div>

        <div className='bg-white border border-gray-200 rounded-[28px] p-6 shadow-sm'>
          <p className='text-gray-500 text-sm'>
            Resolved
          </p>

          <h2 className='text-3xl font-bold text-green-600 mt-2'>
            106
          </h2>
        </div>

      </div>

      {/* Complaints List */}
      <div className='bg-white border border-gray-200 rounded-[32px] p-6 shadow-sm'>

        <div className='flex items-center justify-between mb-6'>

          <div>
            <h2 className='text-2xl font-bold text-black'>
              Recent Complaints
            </h2>

            <p className='text-gray-500 text-sm mt-1'>
              Customer support tickets and complaints.
            </p>
          </div>

          <input
            type='text'
            placeholder='Search complaints...'
            className='bg-[#f7f7f7] border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition-all w-[260px]'
          />

        </div>

        <div className='flex flex-col gap-5'>

          {complaints.map((complaint, index) => (
            <div
              key={index}
              className='border border-gray-200 rounded-[28px] p-6 hover:shadow-md transition-all bg-[#fcfcfc]'
            >

              <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4'>

                {/* Left */}
                <div className='flex-1'>

                  <div className='flex items-center gap-3 flex-wrap'>

                    <h3 className='text-lg font-bold text-black'>
                      {complaint.subject}
                    </h3>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        complaint.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : complaint.status === 'Resolved'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {complaint.status}
                    </span>

                  </div>

                  <p className='text-sm text-gray-500 mt-2'>
                    Complaint ID: {complaint.id}
                  </p>

                  <p className='text-sm text-gray-500'>
                    Customer: {complaint.customer}
                  </p>

                  <p className='text-gray-700 mt-4 leading-relaxed'>
                    {complaint.message}
                  </p>

                </div>

                {/* Right */}
                <div className='flex flex-col gap-3 min-w-[180px]'>

                  <p className='text-sm text-gray-400 text-right'>
                    {complaint.date}
                  </p>

                  <button className='bg-black text-white rounded-2xl py-3 px-5 hover:bg-[#111] transition-all duration-200'>
                    View Details
                  </button>

                  <button className='bg-[#f3f4f6] text-black rounded-2xl py-3 px-5 hover:bg-[#e5e7eb] transition-all duration-200'>
                    Mark Resolved
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  )
}

export default ComplaintsPage