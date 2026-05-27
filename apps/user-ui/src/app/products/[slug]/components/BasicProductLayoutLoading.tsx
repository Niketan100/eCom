'use client'

import React from 'react'
import Link from 'next/link'

import Skeleton from 'apps/user-ui/src/shared/components/Skeleton'

// Mirrors `BasicProductLayout` but uses skeleton blocks.
const BasicProductLayoutLoading = () => {
  return (
    <div className='min-h-screen bg-[#f6f7fb] py-10 px-6'>
      <div className='max-w-7xl mx-auto'>
        {/* BREADCRUMB */}
        <div className='flex items-center gap-2 text-sm text-gray-500 mb-8'>
          <Link href='/products'>Products</Link>
          <span>/</span>
          <Skeleton className='h-4 w-52 rounded' />
        </div>

        {/* HERO SECTION */}
        <div className='grid grid-cols-1 xl:grid-cols-2 gap-8 items-stretch'>
          {/* IMAGE SECTION */}
          <div className='bg-white border border-gray-200 rounded-[40px] overflow-hidden shadow-sm h-[760px]'>
            <Skeleton className='h-full w-full rounded-none' />
          </div>

          {/* INFO SECTION */}
          <div className='bg-white border border-gray-200 rounded-[40px] p-8 shadow-sm h-[760px] flex flex-col justify-between'>
            <div>
              {/* CATEGORY / BRAND */}
              <div className='flex flex-wrap items-center gap-3 mb-6'>
                <Skeleton className='h-9 w-28 rounded-full' />
                <Skeleton className='h-9 w-24 rounded-full' />
              </div>

              {/* TITLE */}
              <Skeleton className='h-12 w-3/4 rounded' />
              <Skeleton className='h-6 w-2/3 rounded mt-4' />

              {/* SHORT DESCRIPTION */}
              <div className='mt-6 space-y-3'>
                <Skeleton className='h-5 w-full rounded' />
                <Skeleton className='h-5 w-5/6 rounded' />
              </div>

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
              <div className='mt-8 flex items-center gap-5 flex-wrap'>
                <Skeleton className='h-14 w-48 rounded' />
                <Skeleton className='h-10 w-28 rounded' />
              </div>

              {/* STOCK */}
              <div className='mt-8 flex items-center gap-4'>
                <Skeleton className='h-9 w-28 rounded-full' />
                <Skeleton className='h-6 w-44 rounded' />
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
            </div>

            {/* CTA BUTTONS */}
            <div>
              <div className='pt-6 border-t border-gray-200 space-y-4'>
                <Skeleton className='h-14 w-full rounded-2xl' />
                <Skeleton className='h-14 w-full rounded-2xl' />
              </div>
            </div>
          </div>
        </div>

        {/* DESCRIPTION SECTION */}
        <div className='mt-10 bg-white border border-gray-200 rounded-[40px] p-8 shadow-sm'>
          <Skeleton className='h-8 w-56 rounded' />
          <div className='mt-6 space-y-3'>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className='h-5 w-full rounded' />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BasicProductLayoutLoading
