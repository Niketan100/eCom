'use client'

import React from 'react'
import { useParams } from 'next/navigation'
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

export default function PaymentReceiptPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id

  const { data, isLoading, isError } = useQuery<{ success: boolean; payment: PaymentDetail }>({
    queryKey: ['seller-payment-receipt', id],
    enabled: Boolean(id),
    queryFn: async () => {
      const res = await axiosInstance.get(`/products/payments/${id}`)
      return res.data
    },
  })

  const payment = data?.payment

  React.useEffect(() => {
    // auto-open print dialog once data is on screen
    if (!payment) return
    const t = setTimeout(() => window.print(), 250)
    return () => clearTimeout(t)
  }, [payment])

  if (isLoading) {
    return <div className='p-6 text-gray-700'>Loading receipt…</div>
  }

  if (isError || !payment) {
    return <div className='p-6 text-red-600'>Failed to load receipt.</div>
  }

  const customerName = payment.order?.user?.name ?? 'Customer'
  const customerEmail = payment.order?.user?.email ?? ''
  const productName = payment.order?.product?.name ?? 'Product'
  const unitPrice = payment.order?.product?.discountedPrice ?? payment.order?.product?.price ?? 0
  const createdAt = new Date(payment.createdAt)

  return (
    <div className='min-h-screen bg-gray-100 p-6 print:bg-white print:p-0'>
      {/* Print styles */}
      <style jsx global>{`
        @page { size: A4; margin: 14mm; }
        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <div className='no-print mb-4 flex items-center justify-end gap-3'>
        <button
          type='button'
          onClick={() => window.print()}
          className='rounded-xl bg-black px-4 py-2 text-white'
        >
          Print
        </button>
      </div>

      <div className='mx-auto max-w-[800px] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden print:shadow-none print:border-none print:rounded-none'>
        <div className='p-6 border-b border-gray-200'>
          <div className='flex items-start justify-between gap-6'>
            <div>
              <h1 className='text-2xl font-bold text-black'>Payment Receipt</h1>
              <p className='text-sm text-gray-500 mt-1'>Thank you for your business.</p>
            </div>

            <div className='text-right'>
              <div className='text-xs text-gray-500'>Receipt Date</div>
              <div className='font-semibold text-black'>{createdAt.toLocaleDateString()}</div>
              <div className='text-xs text-gray-500 mt-3'>Payment ID</div>
              <div className='font-mono text-xs text-black break-all'>{payment.id}</div>
            </div>
          </div>
        </div>

        <div className='p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-gray-200'>
          <div>
            <div className='text-xs uppercase tracking-widest text-gray-500'>Billed To</div>
            <div className='mt-2 font-semibold text-black'>{customerName}</div>
            <div className='text-sm text-gray-600'>{customerEmail || '—'}</div>
          </div>

          <div className='md:text-right'>
            <div className='text-xs uppercase tracking-widest text-gray-500'>Payment Info</div>
            <div className='mt-2 text-sm text-gray-700'>
              <div>
                <span className='text-gray-500'>Order ID:</span>{' '}
                <span className='font-semibold text-black'>{payment.orderId}</span>
              </div>
              <div className='mt-1'>
                <span className='text-gray-500'>Method:</span>{' '}
                <span className='font-semibold text-black'>{payment.paymentMethod ?? 'COD'}</span>
              </div>
              <div className='mt-1'>
                <span className='text-gray-500'>Status:</span>{' '}
                <span className='font-semibold text-black'>{payment.status}</span>
              </div>
            </div>
          </div>
        </div>

        <div className='p-6'>
          <table className='w-full'>
            <thead>
              <tr className='text-left text-xs uppercase tracking-widest text-gray-500 border-b border-gray-200'>
                <th className='py-3'>Item</th>
                <th className='py-3 text-right'>Qty</th>
                <th className='py-3 text-right'>Price</th>
                <th className='py-3 text-right'>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className='border-b border-gray-100'>
                <td className='py-4'>
                  <div className='font-semibold text-black'>{productName}</div>
                  <div className='text-sm text-gray-500'>Order status: {payment.order?.status ?? '—'}</div>
                </td>
                <td className='py-4 text-right text-black'>1</td>
                <td className='py-4 text-right text-black'>₹{Number(unitPrice).toLocaleString()}</td>
                <td className='py-4 text-right font-semibold text-black'>₹{Number(payment.amount || 0).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          <div className='mt-6 flex justify-end'>
            <div className='w-full max-w-[320px] space-y-2'>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-gray-600'>Subtotal</span>
                <span className='text-black'>₹{Number(payment.amount || 0).toLocaleString()}</span>
              </div>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-gray-600'>Tax</span>
                <span className='text-black'>₹0</span>
              </div>
              <div className='h-px bg-gray-200 my-2' />
              <div className='flex items-center justify-between'>
                <span className='font-semibold text-black'>Total</span>
                <span className='text-xl font-bold text-black'>₹{Number(payment.amount || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className='mt-8 text-xs text-gray-400'>
            Generated on {new Date().toLocaleString()}.
          </div>
        </div>
      </div>
    </div>
  )
}
