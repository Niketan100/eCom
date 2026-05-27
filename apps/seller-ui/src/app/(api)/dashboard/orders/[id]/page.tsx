'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance'
import Link from 'next/link'

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

const statusTone = (s: OrderStatus) => {
  if (s === 'DELIVERED') return 'green'
  if (s === 'SHIPPED') return 'blue'
  if (s === 'CONFIRMED') return 'purple'
  if (s === 'CANCELLED') return 'red'
  return 'yellow'
}

const StatusPill = ({ status }: { status: OrderStatus }) => (
  <span
    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
      {
        yellow: 'bg-yellow-100 text-yellow-700',
        purple: 'bg-purple-100 text-purple-700',
        blue: 'bg-blue-100 text-blue-700',
        green: 'bg-green-100 text-green-700',
        red: 'bg-red-100 text-red-700',
      }[statusTone(status)]
    }`}
  >
    {status}
  </span>
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

  const order = orderQuery.data?.order

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

  return (
    <div className='min-h-screen bg-[#f6f7fb] p-6 text-black'>
      <div className='max-w-6xl mx-auto'>
        <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-8'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Process Order</h1>
            <p className='text-gray-500 mt-1'>Order ID: <span className='font-mono text-gray-700'>{orderId}</span></p>
          </div>
          <div className='flex items-center gap-3'>
            <button
              onClick={() => router.back()}
              className='px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50'
            >
              Back
            </button>
            <Link
              href='/dashboard/orders'
              className='px-4 py-2 rounded-xl bg-black text-white hover:bg-[#111]'
            >
              Orders
            </Link>
          </div>
        </div>

        {orderQuery.isLoading ? (
          <div className='bg-white border border-gray-200 rounded-[24px] p-6'>Loading order…</div>
        ) : orderQuery.isError ? (
          <div className='bg-white border border-red-200 rounded-[24px] p-6 text-red-600'>Failed to load order.</div>
        ) : !order ? (
          <div className='bg-white border border-gray-200 rounded-[24px] p-6'>Order not found.</div>
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* LEFT */}
            <div className='lg:col-span-2 space-y-6'>
              <div className='bg-white border border-gray-200 rounded-[28px] p-6 shadow-sm'>
                <div className='flex items-start justify-between gap-4'>
                  <div>
                    <h2 className='text-xl font-bold'>Order Summary</h2>
                    <p className='text-gray-500 mt-1'>Placed: {new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <StatusPill status={order.status} />
                </div>

                <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='bg-[#f7f7f7] rounded-[20px] p-4'>
                    <p className='text-gray-500 text-sm'>Product</p>
                    <p className='font-semibold mt-1'>{order.product?.name}</p>
                    <p className='text-gray-600 text-sm mt-1'>Qty: {order.quantity}</p>
                  </div>
                  <div className='bg-[#f7f7f7] rounded-[20px] p-4'>
                    <p className='text-gray-500 text-sm'>Total</p>
                    <p className='font-bold text-xl mt-1'>₹{order.totalPrice}</p>
                    <p className='text-gray-600 text-sm mt-1'>Unit: ₹{order.product?.discountedPrice ?? order.product?.price}</p>
                  </div>
                </div>
              </div>

              <div className='bg-white border border-gray-200 rounded-[28px] p-6 shadow-sm'>
                <h2 className='text-xl font-bold'>Customer</h2>
                <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='bg-[#f7f7f7] rounded-[20px] p-4'>
                    <p className='text-gray-500 text-sm'>Name</p>
                    <p className='font-semibold mt-1'>{order.user?.name || '—'}</p>
                  </div>
                  <div className='bg-[#f7f7f7] rounded-[20px] p-4'>
                    <p className='text-gray-500 text-sm'>Email</p>
                    <p className='font-semibold mt-1'>{order.user?.email || '—'}</p>
                  </div>
                </div>

                <div className='mt-4 bg-[#f7f7f7] rounded-[20px] p-4'>
                  <p className='text-gray-500 text-sm'>Shipping Address</p>
                  <p className='font-medium mt-1 whitespace-pre-line'>{order.shippingAddress}</p>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className='space-y-6'>
              <div className='bg-white border border-gray-200 rounded-[28px] p-6 shadow-sm'>
                <h2 className='text-xl font-bold'>Payment</h2>
                <div className='mt-4 space-y-3 text-sm'>
                  <div className='flex items-center justify-between'>
                    <span className='text-gray-500'>Status</span>
                    <span className='font-semibold'>{String(order.payment?.status ?? 'PENDING').toUpperCase()}</span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-gray-500'>Method</span>
                    <span className='font-semibold'>{String(order.payment?.method ?? '—').toUpperCase()}</span>
                  </div>
                </div>
              </div>

              <div className='bg-white border border-gray-200 rounded-[28px] p-6 shadow-sm'>
                <h2 className='text-xl font-bold'>Actions</h2>
                <p className='text-gray-500 text-sm mt-1'>Update order status</p>

                <div className='mt-4 space-y-2'>
                  {possibleNext[order.status].length === 0 ? (
                    <div className='text-gray-600 text-sm'>No further actions available for this order.</div>
                  ) : (
                    possibleNext[order.status].map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatusMutation.mutate(s)}
                        disabled={updateStatusMutation.isPending}
                        className='w-full px-4 py-3 rounded-2xl bg-black text-white hover:bg-[#111] disabled:opacity-50'
                      >
                        {updateStatusMutation.isPending ? 'Updating…' : `Mark as ${s}`}
                      </button>
                    ))
                  )}
                </div>

                {updateStatusMutation.isError && (
                  <div className='mt-3 text-sm text-red-600'>Failed to update order.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}