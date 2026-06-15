'use client'

import Link from 'next/link'
import React from 'react'

export default function OffersPage() {
  const offers = [
    {
      id: 'free-delivery',
      title: 'Free Delivery',
      description: 'On selected products and locations. Look for the “Free delivery” badge on product pages.',
      cta: { label: 'Browse products', href: '/products' },
    },
    {
      id: 'season-sale',
      title: 'Season Sale — up to 20% off',
      description: 'Discounts are shown directly on the product page (discounted price).',
      cta: { label: 'See deals', href: '/products' },
    },
    {
      id: 'cod',
      title: 'Cash on Delivery',
      description: 'Pay at delivery for eligible orders. Available at checkout.',
      cta: { label: 'Go to cart', href: '/cart' },
    },
  ]

  return (
    <div className='min-h-screen bg-[#f6f7fb] py-10 px-6 text-black'>
      <div className='max-w-6xl mx-auto'>
        <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8'>
          <div>
            <h1 className='text-4xl font-bold tracking-tight'>Offers</h1>
            <p className='text-gray-600 mt-2'>
              Promotions and deals available in the store. We’ll keep improving this page as we add real campaigns.
            </p>
          </div>
          <Link
            href='/products'
            className='inline-flex items-center justify-center px-5 py-3 rounded-2xl bg-black text-white font-semibold hover:bg-gray-900'
          >
            Explore products
          </Link>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {offers.map((o) => (
            <div key={o.id} className='bg-white border border-gray-200 rounded-[28px] p-6 shadow-sm'>
              <div className='text-lg font-bold'>{o.title}</div>
              <p className='text-sm text-gray-600 mt-2 leading-relaxed'>{o.description}</p>

              <div className='mt-5'>
                <Link
                  href={o.cta.href}
                  className='inline-flex items-center justify-center w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 font-medium'
                >
                  {o.cta.label}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className='mt-10 bg-white border border-gray-200 rounded-[28px] p-6'>
          <h2 className='text-xl font-semibold'>Want more offers?</h2>
          <p className='text-sm text-gray-600 mt-2'>
            We can connect this page to real coupons & campaigns once the backend is ready (events/coupons).
          </p>
        </div>
      </div>
    </div>
  )
}
