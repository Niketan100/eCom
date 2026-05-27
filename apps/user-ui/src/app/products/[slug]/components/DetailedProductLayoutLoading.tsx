'use client'

import React from 'react'
import Link from 'next/link'

import Skeleton from 'apps/user-ui/src/shared/components/Skeleton'

// Mirrors `DetailedProductLayout` but uses skeleton blocks.
const DetailedProductLayoutLoading = () => {
  return (
    <div className='min-h-screen bg-[#f6f7fb] py-10 px-6'>
      <div className='max-w-[1600px] mx-auto'>
        {/* BREADCRUMB */}
        <div className='flex items-center gap-2 text-sm text-gray-500 mb-8'>
          <Link href='/products'>Products</Link>
          <span>/</span>
          <Skeleton className='h-4 w-64 rounded' />
        </div>

        {/* HERO SECTION */}
        <div className='grid grid-cols-1 2xl:grid-cols-[1.05fr_0.95fr] gap-8 items-start'>
          {/* LEFT SIDE */}
          <div className='space-y-8'>
            {/* GALLERY */}
            <div className='bg-white border border-gray-200 rounded-[40px] overflow-hidden shadow-sm'>
              <Skeleton className='h-[520px] w-full rounded-none' />
              <div className='p-6'>
                <div className='flex gap-3'>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className='h-20 w-20 rounded-[20px]' />
                  ))}
                </div>
              </div>
            </div>

            {/* SPECS */}
            <div className='bg-white border border-gray-200 rounded-[40px] p-8 shadow-sm'>
              <Skeleton className='h-8 w-56 rounded' />
              <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-4'>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className='bg-[#f7f7f7] rounded-[28px] p-5'>
                    <Skeleton className='h-4 w-24 rounded' />
                    <Skeleton className='h-6 w-40 rounded mt-3' />
                  </div>
                ))}
              </div>
            </div>

            {/* HIGHLIGHTS */}
            <div className='bg-white border border-gray-200 rounded-[40px] p-8 shadow-sm'>
              <Skeleton className='h-8 w-56 rounded' />
              <div className='mt-6 space-y-3'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className='h-5 w-full rounded' />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className='sticky top-6'>
            <div className='bg-white border border-gray-200 rounded-[40px] p-8 shadow-sm'>
              {/* BADGES */}
              <div className='flex flex-wrap items-center gap-3 mb-6'>
                <Skeleton className='h-9 w-28 rounded-full' />
                <Skeleton className='h-9 w-24 rounded-full' />
                <Skeleton className='h-9 w-28 rounded-full' />
              </div>

              {/* TITLE */}
              <Skeleton className='h-12 w-3/4 rounded' />
              <Skeleton className='h-6 w-2/3 rounded mt-4' />

              {/* TAGS */}
              <div className='flex flex-wrap gap-3 mt-6'>
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className='h-9 w-20 rounded-full' />
                ))}
              </div>

              {/* RATING */}
              <div className='flex items-center gap-4 mt-8'>
                <Skeleton className='h-6 w-28 rounded' />
                <Skeleton className='h-6 w-40 rounded' />
              </div>

              {/* PRICE */}
              <div className='mt-10 flex items-center gap-5 flex-wrap'>
                <Skeleton className='h-14 w-48 rounded' />
                <Skeleton className='h-10 w-36 rounded' />
              </div>

              {/* STOCK */}
              <div className='mt-8 flex items-center gap-4 flex-wrap'>
                <Skeleton className='h-9 w-28 rounded-full' />
                <Skeleton className='h-6 w-44 rounded' />
              </div>

              {/* VARIANTS */}
              <div className='mt-10'>
                <Skeleton className='h-6 w-40 rounded' />
                <div className='mt-4 grid grid-cols-2 gap-3'>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className='h-12 w-full rounded-2xl' />
                  ))}
                </div>
              </div>

              {/* QUANTITY */}
              <div className='mt-10'>
                <Skeleton className='h-6 w-32 rounded mb-4' />
                <div className='flex items-center gap-4'>
                  <Skeleton className='h-14 w-14 rounded-2xl' />
                  <Skeleton className='h-14 w-20 rounded-2xl' />
                  <Skeleton className='h-14 w-14 rounded-2xl' />
                </div>
              </div>

              {/* CTA BUTTONS */}
              <div className='pt-8 border-t border-gray-200 mt-8 space-y-4'>
                <Skeleton className='h-14 w-full rounded-2xl' />
                <Skeleton className='h-14 w-full rounded-2xl' />
              </div>
            </div>

            {/* Shipping + seller blocks */}
            <div className='mt-8 space-y-8'>
              <div className='bg-white border border-gray-200 rounded-[40px] p-8 shadow-sm'>
                <Skeleton className='h-8 w-64 rounded' />
                <div className='mt-6 space-y-4'>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className='bg-[#f7f7f7] rounded-[28px] p-5'>
                      <Skeleton className='h-4 w-20 rounded' />
                      <Skeleton className='h-6 w-44 rounded mt-3' />
                    </div>
                  ))}
                </div>
              </div>

              <div className='bg-white border border-gray-200 rounded-[40px] p-8 shadow-sm'>
                <Skeleton className='h-8 w-64 rounded' />
                <div className='mt-6 flex items-center gap-5'>
                  <Skeleton className='h-24 w-24 rounded-[30px]' />
                  <div className='flex-1'>
                    <Skeleton className='h-7 w-56 rounded' />
                    <Skeleton className='h-5 w-72 rounded mt-3' />
                    <div className='flex items-center gap-3 mt-4'>
                      <Skeleton className='h-8 w-32 rounded-full' />
                      <Skeleton className='h-5 w-16 rounded' />
                    </div>
                  </div>
                </div>
                <Skeleton className='h-12 w-full rounded-2xl mt-10' />
              </div>
            </div>
          </div>
        </div>

        {/* REVIEWS */}
        <div className='mt-8 bg-white border border-gray-200 rounded-[40px] p-8 shadow-sm'>
          <Skeleton className='h-8 w-56 rounded' />
          <div className='mt-6 space-y-5'>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className='border border-gray-100 rounded-[28px] p-5'>
                <div className='flex items-center gap-4'>
                  <Skeleton className='h-12 w-12 rounded-full' />
                  <div className='flex-1'>
                    <Skeleton className='h-5 w-40 rounded' />
                    <Skeleton className='h-4 w-28 rounded mt-2' />
                  </div>
                </div>
                <Skeleton className='h-4 w-full rounded mt-4' />
                <Skeleton className='h-4 w-5/6 rounded mt-2' />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailedProductLayoutLoading
