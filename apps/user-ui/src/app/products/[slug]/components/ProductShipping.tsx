'use client'

import React from 'react'

const ProductShipping = ({
   product
}: any) => {

   return (

      <div className='bg-white border border-gray-200 rounded-[32px] p-6 shadow-sm h-full flex flex-col justify-between'>

         {/* TOP */}

         <div>

            <div className='mb-6'>

               <h2 className='text-2xl font-bold text-black'>
                  Shipping & Services
               </h2>

               <p className='text-gray-500 mt-2'>
                  Delivery and support details
               </p>

            </div>

            {/* CARDS */}

            <div className='space-y-4'>

               <div className='bg-[#f7f7f7] rounded-2xl p-5'>

                  <h3 className='font-semibold text-black'>
                     Free Delivery
                  </h3>

                  <p className='text-gray-500 mt-2 text-sm leading-relaxed'>
                     Eligible for fast and secure shipping.
                  </p>

               </div>

               <div className='bg-[#f7f7f7] rounded-2xl p-5'>

                  <h3 className='font-semibold text-black'>
                     Warranty
                  </h3>

                  <p className='text-gray-500 mt-2 text-sm leading-relaxed'>
                     {product.warranty ||
                        'No warranty information'}
                  </p>

               </div>

               <div className='bg-[#f7f7f7] rounded-2xl p-5'>

                  <h3 className='font-semibold text-black'>
                     Shipping Weight
                  </h3>

                  <p className='text-gray-500 mt-2 text-sm leading-relaxed'>
                     {product.shippingWeight ||
                        'N/A'}
                  </p>

               </div>

            </div>

         </div>

         {/* BOTTOM */}

         <div className='mt-8 bg-black text-white rounded-2xl p-5'>

            <p className='text-sm text-gray-300'>
               Estimated Delivery
            </p>

            <h3 className='text-3xl font-bold mt-2'>
               3 - 5 Days
            </h3>

         </div>

      </div>

   )

}

export default ProductShipping