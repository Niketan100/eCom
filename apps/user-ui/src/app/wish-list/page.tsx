'use client'

import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../../utils/axiosInstance'
import Link from 'next/link'

type WishlistItem = {
  id: string
  product: {
    id: string
    name: string
    slug: string
    price: number
    discountedPrice?: number | null
    stock: number
    category?: string | null
    subcategory?: string | null
  }
}

export default function WishListPage() {
  const queryClient = useQueryClient()

  const wishlistQuery = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const res = await axiosInstance.get('/products/wishlist')
      return res.data as { items: WishlistItem[] }
    },
  })

  const items = wishlistQuery.data?.items || []

  const removeMutation = useMutation({
    mutationFn: async (productId: string) => {
      await axiosInstance.delete(`/products/wishlist/${productId}`)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['wishlist'] })
      await queryClient.invalidateQueries({ queryKey: ['wishlist-count'] })
    },
  })

  return (
    <div className='min-h-screen bg-[#f6f7fb] py-10 px-6 text-black'>
      <div className='max-w-5xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold tracking-tight'>Wishlist</h1>
          <p className='text-gray-500 mt-2'>Save products you like and revisit them later.</p>
        </div>

        {wishlistQuery.isLoading ? (
          <div className='bg-white border border-gray-200 rounded-[24px] p-6'>Loading wishlist…</div>
        ) : wishlistQuery.isError ? (
          <div className='bg-white border border-red-200 rounded-[24px] p-6 text-red-600'>Failed to load wishlist.</div>
        ) : items.length === 0 ? (
          <div className='bg-white border border-gray-200 rounded-[24px] p-10 text-center'>
            <p className='text-gray-600'>Your wishlist is empty.</p>
            <Link href='/products' className='inline-block mt-4 px-5 py-3 rounded-2xl bg-black text-white'>
              Browse products
            </Link>
          </div>
        ) : (
          <div className='bg-white border border-gray-200 rounded-[24px] overflow-hidden'>
            <div className='divide-y divide-gray-200'>
              {items.map((item) => {
                const p = item.product
                const price = (p.discountedPrice ?? p.price) || 0
                return (
                  <div key={item.id} className='p-5 flex flex-col sm:flex-row sm:items-center gap-4'>
                    <div className='flex-1'>
                      <Link href={`/products/${encodeURIComponent(p.slug)}`} className='font-semibold hover:underline'>
                        {p.name}
                      </Link>
                      <div className='text-sm text-gray-500 mt-1'>
                        ₹{price} • Stock: {p.stock}
                      </div>
                    </div>

                    <div className='font-bold w-24 text-right'>₹{price}</div>

                    <button
                      onClick={() => removeMutation.mutate(p.id)}
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
        )}
      </div>
    </div>
  )
}
