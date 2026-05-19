'use client'

import React from 'react'

const ProductSpecs = ({
   product
}: any) => {

   if (
      !product.features ||
      product.features.length === 0
   ) {

      return null

   }

   return (

      <div className='bg-white border border-gray-200 rounded-[40px] p-8 shadow-sm mt-8'>

         {/* HEADER */}

         <div className='mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5'>

            <div>

               <h2 className='text-3xl font-bold text-black'>
                  Technical Specifications
               </h2>

               <p className='text-gray-500 mt-2 text-lg'>
                  Detailed product information and technical data
               </p>

            </div>

            <div className='bg-[#f7f7f7] border border-gray-200 rounded-2xl px-5 py-4'>

               <p className='text-sm text-gray-400'>
                  Specifications
               </p>

               <h3 className='text-2xl font-bold text-black mt-1'>
                  {
                     product.features
                        .length
                  }
               </h3>

            </div>

         </div>

         {/* SPECS TABLE */}

         <div className='border border-gray-200 rounded-[32px] overflow-hidden'>

            {product.features.map(
               (
                  feature: any,
                  index: number
               ) => (

                  <div
                     key={index}
                     className={`grid grid-cols-1 md:grid-cols-[320px_1fr] ${
                        index !==
                        product.features
                           .length -
                           1
                           ? 'border-b border-gray-200'
                           : ''
                     }`}
                  >

                     {/* KEY */}

                     <div className='bg-[#fafafa] p-6 border-r border-gray-200 flex items-center'>

                        <div>

                           <h3 className='text-lg font-semibold text-black'>
                              {
                                 feature.key
                              }
                           </h3>

                           <p className='text-sm text-gray-400 mt-1'>
                              Product Specification
                           </p>

                        </div>

                     </div>

                     {/* VALUE */}

                     <div className='p-6 flex items-center justify-between gap-5 flex-wrap'>

                        <div>

                           <h3 className='text-lg font-medium text-gray-700'>
                              {
                                 feature.value
                              }
                           </h3>

                        </div>

                        <div className='bg-[#f3f4f6] px-4 py-2 rounded-full text-sm font-medium text-gray-600'>

                           Verified

                        </div>

                     </div>

                  </div>

               )
            )}

         </div>

         {/* EXTRA DETAILS */}

         <div className='grid grid-cols-1 md:grid-cols-3 gap-5 mt-8'>

            <div className='bg-[#f7f7f7] border border-gray-200 rounded-[28px] p-6'>

               <div className='w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center text-2xl mb-5'>

                  ⚡

               </div>

               <h3 className='text-xl font-semibold text-black'>
                  Premium Quality
               </h3>

               <p className='text-gray-500 mt-3 leading-relaxed'>
                  Carefully crafted with high-quality materials and tested standards.
               </p>

            </div>

            <div className='bg-[#f7f7f7] border border-gray-200 rounded-[28px] p-6'>

               <div className='w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center text-2xl mb-5'>

                  🛡️

               </div>

               <h3 className='text-xl font-semibold text-black'>
                  Reliable Performance
               </h3>

               <p className='text-gray-500 mt-3 leading-relaxed'>
                  Designed to deliver smooth and dependable performance daily.
               </p>

            </div>

            <div className='bg-[#f7f7f7] border border-gray-200 rounded-[28px] p-6'>

               <div className='w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center text-2xl mb-5'>

                  🚀

               </div>

               <h3 className='text-xl font-semibold text-black'>
                  Modern Technology
               </h3>

               <p className='text-gray-500 mt-3 leading-relaxed'>
                  Built using updated technologies for enhanced user experience.
               </p>

            </div>

         </div>

      </div>

   )

}

export default ProductSpecs