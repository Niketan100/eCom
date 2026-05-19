'use client'

import React from 'react'

import Link from 'next/link'

const ProductSeller = ({
   product
}: any) => {

   const seller =
      product?.seller

   const shop =
      product?.shop

   return (

      <div className='bg-white border border-gray-200 rounded-[32px] p-6 shadow-sm h-full flex flex-col justify-between'>

         {/* TOP */}

         <div>

            <div className='mb-6'>

               <h2 className='text-2xl font-bold text-black'>
                  Seller Information
               </h2>

               <p className='text-gray-500 mt-2'>
                  Trusted marketplace seller
               </p>

            </div>

            {/* SELLER */}

            <div className='flex items-center gap-4'>

               <div className='w-20 h-20 rounded-[24px] bg-black text-white flex items-center justify-center text-3xl font-bold flex-shrink-0'>

                  {shop?.name
                     ?.charAt(0)
                     ?.toUpperCase() || 'S'}

               </div>

               <div>

                  <h3 className='text-2xl font-bold text-black'>
                     {shop?.name ||
                        'Official Store'}
                  </h3>

                  <p className='text-gray-500 mt-1'>
                     {seller?.name ||
                        'Verified Seller'}
                  </p>

                  <div className='flex items-center gap-2 mt-3'>

                     <span className='bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium'>
                        Verified
                     </span>

                     <span className='text-sm text-gray-400'>
                        ⭐ 4.8
                     </span>

                  </div>

               </div>

            </div>

            {/* STATS */}

            <div className='grid grid-cols-2 gap-4 mt-8'>

               <div className='bg-[#f7f7f7] rounded-2xl p-4'>

                  <p className='text-sm text-gray-400'>
                     Products
                  </p>

                  <h4 className='text-2xl font-bold text-black mt-2'>
                     120+
                  </h4>

               </div>

               <div className='bg-[#f7f7f7] rounded-2xl p-4'>

                  <p className='text-sm text-gray-400'>
                     Orders
                  </p>

                  <h4 className='text-2xl font-bold text-black mt-2'>
                     5K+
                  </h4>

               </div>

            </div>

         </div>

         {/* BOTTOM */}

         <div className='flex gap-3 mt-8'>

            <Link
               href={`/shop/${shop?.id}`}
               className='flex-1'
            >

               <button className='w-full bg-black text-white py-4 rounded-2xl font-semibold hover:bg-[#111] transition-all'>

                  Visit Store

               </button>

            </Link>

            <button className='flex-1 border border-black text-black py-4 rounded-2xl font-semibold hover:bg-black hover:text-white transition-all'>

               Contact

            </button>

         </div>

      </div>

   )

}

export default ProductSeller