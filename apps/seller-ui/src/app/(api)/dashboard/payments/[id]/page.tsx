'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance'

type PaymentDetail = {
  id: string
  orderId: string
  amount: number
  paymentMethod?: string | null
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
  createdAt: string
  order?: {
    id: string
    status: string
    sellerId?: string
    createdAt?: string
    user?: { id: string; name: string; email: string }
    product?: {
      id: string
      name: string
      slug?: string
      price: number
      discountedPrice?: number | null
    }
  }
}

export default function PaymentDetailsPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params?.id

  const { data, isLoading, isError } = useQuery<{ success: boolean; payment: PaymentDetail }>({
    queryKey: ['seller-payment', id],
    enabled: Boolean(id),
    queryFn: async () => {
      const res = await axiosInstance.get(`/products/payments/${id}`)
      return res.data
    },
  })

  const payment = data?.payment

  if (isLoading) {
    return (
      <div className='min-h-screen bg-[#f6f7fb] p-6'>
        <div className='max-w-5xl mx-auto bg-white border border-gray-200 rounded-[32px] p-6'>
          <div className='text-gray-600'>Loading payment…</div>
        </div>
      </div>
    )
  }

  if (isError || !payment) {
    return (
      <div className='min-h-screen bg-[#f6f7fb] p-6'>
        <div className='max-w-5xl mx-auto bg-white border border-gray-200 rounded-[32px] p-6'>
          <div className='flex items-center justify-between gap-4'>
            <div>
              <h1 className='text-2xl font-bold text-black'>Payment not found</h1>
              <p className='text-gray-500 mt-1'>We couldn’t load this payment.</p>
            </div>
            <button
              type='button'
              onClick={() => router.back()}
              className='px-4 py-2 rounded-xl bg-black text-white'
            >
              Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  const customerName = payment.order?.user?.name ?? 'Customer'
  const customerEmail = payment.order?.user?.email ?? ''
  const productName = payment.order?.product?.name ?? 'Product'
  const productPrice = payment.order?.product?.discountedPrice ?? payment.order?.product?.price

  return (
    <div className='min-h-screen bg-[#f6f7fb] p-6'>
      <div className='max-w-5xl mx-auto'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight text-black'>Payment Details</h1>
            <p className='text-gray-500 mt-2'>Payment ID: {payment.id}</p>
          </div>

          <div className='flex gap-3'>
            <button
              type='button'
              onClick={() => window.print()}
              className='bg-[#f3f4f6] text-black px-4 py-2 rounded-xl hover:bg-[#e5e7eb] transition-all duration-200'
            >
              Receipt
            </button>
            <button
              type='button'
              onClick={() => router.back()}
              className='bg-black text-white px-4 py-2 rounded-xl hover:bg-[#111] transition-all duration-200'
            >
              Back
            </button>
          </div>
        </div>

        <div className='bg-white border border-gray-200 rounded-[32px] p-6 shadow-sm'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='rounded-2xl border border-gray-200 p-5'>
              <h2 className='text-lg font-semibold text-black'>Summary</h2>
              <div className='mt-4 space-y-2 text-sm'>
                <div className='flex justify-between gap-4'>
                  <span className='text-gray-500'>Status</span>
                  <span className='font-semibold text-black'>{payment.status}</span>
                </div>
                <div className='flex justify-between gap-4'>
                  <span className='text-gray-500'>Method</span>
                  <span className='font-semibold text-black'>{payment.paymentMethod ?? 'COD'}</span>
                </div>
                <div className='flex justify-between gap-4'>
                  <span className='text-gray-500'>Amount</span>
                  <span className='font-semibold text-black'>₹{Number(payment.amount || 0).toLocaleString()}</span>
                </div>
                <div className='flex justify-between gap-4'>
                  <span className='text-gray-500'>Date</span>
                  <span className='font-semibold text-black'>{new Date(payment.createdAt).toLocaleString()}</span>
                </div>
                <div className='flex justify-between gap-4'>
                  <span className='text-gray-500'>Order ID</span>
                  <span className='font-semibold text-black'>{payment.orderId}</span>
                </div>
              </div>
            </div>

            <div className='rounded-2xl border border-gray-200 p-5'>
              <h2 className='text-lg font-semibold text-black'>Customer</h2>
              <div className='mt-4 space-y-2 text-sm'>
                <div className='flex justify-between gap-4'>
                  <span className='text-gray-500'>Name</span>
                  <span className='font-semibold text-black'>{customerName}</span>
                </div>
                <div className='flex justify-between gap-4'>
                  <span className='text-gray-500'>Email</span>
                  <span className='font-semibold text-black'>{customerEmail || '—'}</span>
                </div>
              </div>
            </div>

            <div className='rounded-2xl border border-gray-200 p-5 md:col-span-2'>
              <h2 className='text-lg font-semibold text-black'>Order Item</h2>
              <div className='mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
                <div>
                  <div className='font-semibold text-black'>{productName}</div>
                  <div className='text-sm text-gray-500'>Order status: {payment.order?.status ?? '—'}</div>
                </div>
                <div className='font-semibold text-black'>₹{Number(productPrice || 0).toLocaleString()}</div>
              </div>
            </div>
          </div>

          <p className='mt-6 text-xs text-gray-400'>
            Tip: Use the Receipt button to print or “Save as PDF”.
          </p>
        </div>
      </div>
    </div>
  )
}
