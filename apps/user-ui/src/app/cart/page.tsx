'use client'

import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../../utils/axiosInstance'
import Link from 'next/link'

type CartItem = {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    slug: string
    price: number
    discountedPrice?: number | null
    stock: number
  }
}

export default function CartPage() {
  const queryClient = useQueryClient()

  const cartQuery = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await axiosInstance.get('/products/cart')
      return res.data as { items: CartItem[]; totals?: { quantity: number; subtotal: number } }
    },
  })

  const items = cartQuery.data?.items || []
  const totals = cartQuery.data?.totals

  const removeMutation = useMutation({
    mutationFn: async (productId: string) => {
      await axiosInstance.delete(`/products/cart/${productId}`)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cart'] })
      await queryClient.invalidateQueries({ queryKey: ['cart-count'] })
    },
  })

  const clearMutation = useMutation({
    mutationFn: async () => {
      await axiosInstance.delete('/products/cart')
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cart'] })
      await queryClient.invalidateQueries({ queryKey: ['cart-count'] })
    },
  })

  const updateQtyMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      await axiosInstance.patch(`/products/cart/${productId}`, { quantity })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cart'] })
      await queryClient.invalidateQueries({ queryKey: ['cart-count'] })
    },
  })

  return (
    <div className='min-h-screen bg-[#f6f7fb] py-10 px-6 text-black'>
      <div className='max-w-5xl mx-auto'>
        <div className='flex items-end justify-between gap-4 mb-8'>
          <div>
            <h1 className='text-4xl font-bold tracking-tight'>Cart</h1>
            <p className='text-gray-500 mt-2'>Review items and update quantities.</p>
          </div>
          <button
            disabled={clearMutation.isPending || items.length === 0}
            onClick={() => clearMutation.mutate()}
            className='px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50'
          >
            Clear cart
          </button>
        </div>

        {cartQuery.isLoading ? (
          <div className='bg-white border border-gray-200 rounded-[24px] p-6'>Loading cart…</div>
        ) : cartQuery.isError ? (
          <div className='bg-white border border-red-200 rounded-[24px] p-6 text-red-600'>Failed to load cart.</div>
        ) : items.length === 0 ? (
          <div className='bg-white border border-gray-200 rounded-[24px] p-10 text-center'>
            <p className='text-gray-600'>Your cart is empty.</p>
            <Link href='/products' className='inline-block mt-4 px-5 py-3 rounded-2xl bg-black text-white'>
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className='space-y-4'>
            {/* Items */}
            <div className='bg-white border border-gray-200 rounded-[24px] overflow-hidden'>
              <div className='divide-y divide-gray-200'>
                {items.map((item) => {
                  const unit = (item.product.discountedPrice ?? item.product.price) || 0
                  const lineTotal = unit * (item.quantity || 1)
                  return (
                    <div key={item.id} className='p-5 flex flex-col sm:flex-row sm:items-center gap-4'>
                      <div className='flex-1'>
                        <Link href={`/products/${encodeURIComponent(item.product.slug)}`} className='font-semibold hover:underline'>
                          {item.product.name}
                        </Link>
                        <div className='text-sm text-gray-500 mt-1'>
                          ₹{unit} • Stock: {item.product.stock}
                        </div>
                      </div>

                      <div className='flex items-center gap-2'>
                        <button
                          onClick={() => updateQtyMutation.mutate({ productId: item.product.id, quantity: (item.quantity || 1) - 1 })}
                          className='w-10 h-10 rounded-xl border bg-white hover:bg-gray-50'
                        >
                          −
                        </button>
                        <div className='w-12 text-center font-semibold'>{item.quantity}</div>
                        <button
                          onClick={() => updateQtyMutation.mutate({ productId: item.product.id, quantity: (item.quantity || 1) + 1 })}
                          className='w-10 h-10 rounded-xl border bg-white hover:bg-gray-50'
                        >
                          +
                        </button>
                      </div>

                      <div className='w-32 text-right font-bold'>₹{lineTotal}</div>

                      <button
                        onClick={() => removeMutation.mutate(item.product.id)}
                        disabled={removeMutation.isPending}
                        className='px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50'
                      >
                        Remove
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Summary */}
            <div className='bg-white border border-gray-200 rounded-[24px] p-6 flex items-center justify-between'>
              <div className='text-gray-600'>
                Items: <span className='font-semibold text-black'>{totals?.quantity ?? items.reduce((a, i) => a + (i.quantity || 1), 0)}</span>
              </div>
              <div className='text-xl font-bold'>
                Subtotal: ₹{totals?.subtotal ?? 0}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
