'use client'

import Link from 'next/link'
import React from 'react'

export default function BecomeSellerPage() {
  const sellerUrl = process.env.NEXT_PUBLIC_SELLER_URL || 'http://localhost:3001'

  return (
    <div className='min-h-screen bg-[#f6f7fb] py-10 px-6 text-black'>
      <div className='max-w-5xl mx-auto'>
        <div className='bg-white border border-gray-200 rounded-[32px] p-8 shadow-sm'>
          <h1 className='text-4xl font-bold tracking-tight'>Become a Seller</h1>
          <p className='text-gray-600 mt-3 leading-relaxed'>
            Start selling your products on Eshop. Create a seller account, set up your shop, and manage inventory, orders and payments
            from the seller dashboard.
          </p>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-8'>
            <div className='rounded-2xl border border-gray-200 p-5'>
              <div className='text-sm text-gray-500'>Step 1</div>
              <div className='font-semibold mt-1'>Create seller account</div>
              <div className='text-sm text-gray-600 mt-2'>Register & verify your email/OTP.</div>
            </div>
            <div className='rounded-2xl border border-gray-200 p-5'>
              <div className='text-sm text-gray-500'>Step 2</div>
              <div className='font-semibold mt-1'>Create your shop</div>
              <div className='text-sm text-gray-600 mt-2'>Add business details and shop category.</div>
            </div>
            <div className='rounded-2xl border border-gray-200 p-5'>
              <div className='text-sm text-gray-500'>Step 3</div>
              <div className='font-semibold mt-1'>Add products & sell</div>
              <div className='text-sm text-gray-600 mt-2'>List products, receive orders, track payments.</div>
            </div>
          </div>

          <div className='flex flex-col sm:flex-row gap-4 mt-8'>
            <a
              href={`${sellerUrl}/login`}
              target='_blank'
              rel='noreferrer'
              className='inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-black text-white font-semibold hover:bg-gray-900'
            >
              Go to Seller Login
            </a>

            <a
              href={`${sellerUrl}/register`}
              target='_blank'
              rel='noreferrer'
              className='inline-flex items-center justify-center px-6 py-3 rounded-2xl border border-gray-200 bg-white font-semibold hover:bg-gray-50'
            >
              Create Seller Account
            </a>

            <Link
              href='/products'
              className='inline-flex items-center justify-center px-6 py-3 rounded-2xl border border-gray-200 bg-white font-semibold hover:bg-gray-50'
            >
              Continue shopping
            </Link>
          </div>

          <div className='mt-8 text-xs text-gray-500'>
            Tip: You can set <span className='font-mono'>NEXT_PUBLIC_SELLER_URL</span> in your env to point to the seller UI domain.
          </div>
        </div>
      </div>
    </div>
  )
}
