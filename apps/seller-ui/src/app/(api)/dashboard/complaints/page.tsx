'use client'

import { useQueries } from '@tanstack/react-query'
import React from 'react'
import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance'


const ComplaintsPage = () => {
  const [search, setSearch] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'pending' | 'resolved'>('all')

  const complaintsQuery = useQueries({
    queries: [
      {
        queryKey: ['complaints'],
        queryFn: async () => {
          const response = await axiosInstance.get('auth/complaints/get-complaints')
          return response.data
        },
      }
    ]
  })
  const complaints = complaintsQuery[0].data?.complaints || [];
  console.log('Fetched complaints:', complaints)
  console.log(complaintsQuery);

  const filteredComplaints = React.useMemo(() => {
    const q = search.trim().toLowerCase()

    return complaints.filter((c: any) => {
      const status = String(c?.status ?? '').toLowerCase()
      const matchesStatus = statusFilter === 'all' ? true : status === statusFilter

      if (!q) return matchesStatus

      const haystack = [
        c?.subject,
        c?.message,
        c?.customer,
        c?.id,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return matchesStatus && haystack.includes(q)
    })
  }, [complaints, search, statusFilter])

   if(complaintsQuery[0].isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-gray-500 text-lg'>Loading complaints...</p>
      </div>
    )
  }

  if(complaintsQuery[0].error) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-red-500 text-lg'>Failed to load complaints. Please try again.</p>
      </div>
    )
  }

  const normalizeStatus = (value: any) => String(value ?? '').trim().toLowerCase();
  
         
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
            {complaints.length}
          </h2>
        </div>

        <div className='bg-white border border-gray-200 rounded-[28px] p-6 shadow-sm'>
          <p className='text-gray-500 text-sm'>
            Pending
          </p>

          <h2 className='text-3xl font-bold text-yellow-600 mt-2'>
            {complaints.filter((p: any) => normalizeStatus(p.status) === 'pending').length}
          </h2>
        </div>

        <div className='bg-white border border-gray-200 rounded-[28px] p-6 shadow-sm'>
          <p className='text-gray-500 text-sm'>
            Resolved
          </p>

          <h2 className='text-3xl font-bold text-green-600 mt-2'>
            {complaints.filter((p:any) => normalizeStatus(p.status) === 'resolved').length}
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

          <div className='flex flex-col sm:flex-row gap-3 items-stretch sm:items-center'>
            <input
              type='text'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search complaints...'
              className='bg-[#f7f7f7] border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition-all w-[260px]'
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className='bg-[#f7f7f7] border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition-all'
            >
              <option value='all'>All</option>
              <option value='pending'>Pending</option>
              <option value='resolved'>Resolved</option>
            </select>
          </div>

        </div>

        <div className='flex flex-col gap-5'>

          {filteredComplaints.map((complaint:any, index:number) => (
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
                        normalizeStatus(complaint.status) === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : normalizeStatus(complaint.status) === 'resolved'
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
                    Customer: {complaint?.user?.name || complaint?.user?.email || 'Unknown'}
                  </p>

                  <p className='text-gray-700 mt-4 leading-relaxed'>
                    {complaint.message}
                  </p>

                </div>

                {/* Right */}
                <div className='flex flex-col gap-3 min-w-[180px]'>

                  <p className='text-sm text-gray-400 text-right'>
                    {complaint?.createdAt ? new Date(complaint.createdAt).toLocaleString() : ''}
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

          {filteredComplaints.length === 0 && (
            <div className='text-center text-gray-500 py-10'>
              No complaints match your filters.
            </div>
          )}

        </div>

      </div>

    </div>
  )
}

export default ComplaintsPage