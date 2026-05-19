'use client'

import React from 'react'

const ProductHighlights = ({
   product
}: any) => {

   if (
      !product.highlights ||
      product.highlights.length === 0
   ) {

      return null

   }

   return (

      <div className='bg-white border border-gray-200 rounded-[40px] p-8 shadow-sm mt-8'>

         {/* HEADER */}

         <div className='mb-8'>

            <h2 className='text-3xl font-bold text-black'>
               Product Highlights
            </h2>

            <p className='text-gray-500 mt-2 text-lg'>
               Key features and major selling points
            </p>

         </div>

         {/* GRID */}

         <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>

            {product.highlights.map(
               (
                  highlight: string,
                  index: number
               ) => (

                  <div
                     key={index}
                     className='bg-[#f7f7f7] border border-gray-100 rounded-[28px] p-6 hover:bg-black hover:text-white transition-all duration-300 group'
                  >

                     <div className='flex items-start gap-4'>

                        {/* ICON */}

                        <div className='w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all flex-shrink-0'>

                           ✓

                        </div>

                        {/* CONTENT */}

                        <div>

                           <h3 className='text-lg font-semibold leading-relaxed'>
                              {highlight}
                           </h3>

                           <p className='text-sm text-gray-500 mt-2 group-hover:text-gray-300 transition-all'>
                              Premium feature included with this product
                           </p>

                        </div>

                     </div>

                  </div>

               )
            )}

         </div>

         {/* EXTRA INFO */}

         <div className='mt-8 bg-[#fafafa] border border-gray-200 rounded-[30px] p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5'>

            <div>

               <h3 className='text-xl font-semibold text-black'>
                  Why customers love this product
               </h3>

               <p className='text-gray-500 mt-2'>
                  Carefully selected features designed for better user experience
               </p>

            </div>

            <div className='flex items-center gap-4 flex-wrap'>

               <div className='bg-white border border-gray-200 px-5 py-3 rounded-2xl shadow-sm'>

                  <p className='text-sm text-gray-400'>
                     Highlights
                  </p>

                  <h4 className='text-2xl font-bold text-black mt-1'>
                     {
                        product.highlights
                           .length
                     }
                  </h4>

               </div>

               <div className='bg-white border border-gray-200 px-5 py-3 rounded-2xl shadow-sm'>

                  <p className='text-sm text-gray-400'>
                     Quality
                  </p>

                  <h4 className='text-2xl font-bold text-black mt-1'>
                     Premium
                  </h4>

               </div>

            </div>

         </div>

      </div>

   )

}

export default ProductHighlights