'use client'

import React from 'react'

const ProductVariants = ({
   product,
   selectedVariant,
   setSelectedVariant
}: any) => {

   if (
      !product.variants ||
      product.variants.length === 0
   ) {

      return null

   }

   // group variants by type

   const groupedVariants =
      product.variants.reduce(
         (
            acc: any,
            variant: any
         ) => {

            if (
               !acc[
                  variant.type
               ]
            ) {

               acc[
                  variant.type
               ] = []

            }

            acc[
               variant.type
            ].push(variant)

            return acc

         },
         {}
      )

   return (

      <div className='mt-10'>

         {/* HEADER */}

         <div className='mb-6'>

            <h2 className='text-2xl font-bold text-black'>
               Available Variants
            </h2>

            <p className='text-gray-500 mt-2'>
               Choose the best option for your needs
            </p>

         </div>

         {/* VARIANT GROUPS */}

         <div className='space-y-8'>

            {Object.entries(
               groupedVariants
            ).map(
               (
                  [
                     type,
                     values
                  ]: any,
                  groupIndex
               ) => (

                  <div
                     key={
                        groupIndex
                     }
                  >

                     {/* TYPE */}

                     <div className='flex items-center justify-between mb-4'>

                        <div>

                           <h3 className='text-lg font-semibold text-black'>
                              {type}
                           </h3>

                           <p className='text-sm text-gray-400 mt-1'>
                              Select your preferred
                              {' '}
                              {
                                 type
                              }
                           </p>

                        </div>

                        <div className='bg-[#f3f4f6] px-4 py-2 rounded-full text-sm font-medium text-gray-600'>

                           {
                              values.length
                           }
                           {' '}
                           options

                        </div>

                     </div>

                     {/* OPTIONS */}

                     <div className='flex flex-wrap gap-4'>

                        {values.map(
                           (
                              variant: any,
                              index: number
                           ) => {

                              const isSelected =
                                 selectedVariant?.id ===
                                 variant.id

                              return (

                                 <button
                                    key={
                                       index
                                    }
                                    onClick={() =>
                                       setSelectedVariant(
                                          variant
                                       )
                                    }
                                    className={`group relative overflow-hidden border rounded-[26px] px-6 py-5 min-w-[170px] text-left transition-all duration-300 ${
                                       isSelected
                                          ? 'border-black bg-black text-white shadow-xl scale-[1.02]'
                                          : 'border-gray-200 bg-white hover:border-black hover:shadow-lg'
                                    }`}
                                 >

                                    {/* SELECTED BADGE */}

                                    {isSelected && (

                                       <div className='absolute top-3 right-3 w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-xs font-bold'>

                                          ✓

                                       </div>

                                    )}

                                    {/* VALUE */}

                                    <h4 className='text-lg font-semibold'>
                                       {
                                          variant.value
                                       }
                                    </h4>

                                    {/* STOCK */}

                                    <p
                                       className={`text-sm mt-2 ${
                                          isSelected
                                             ? 'text-gray-300'
                                             : 'text-gray-500'
                                       }`}
                                    >

                                       Stock:
                                       {' '}
                                       {
                                          variant.stock
                                       }

                                    </p>

                                    {/* EXTRA PRICE */}

                                    {variant.additionalPrice >
                                       0 && (

                                       <div className='mt-4 inline-flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium'>

                                          +
                                          ₹
                                          {
                                             variant.additionalPrice
                                          }

                                       </div>

                                    )}

                                    {/* OUT OF STOCK */}

                                    {variant.stock ===
                                       0 && (

                                       <div className='mt-4 inline-flex items-center bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium'>

                                          Out Of Stock

                                       </div>

                                    )}

                                 </button>

                              )

                           }
                        )}

                     </div>

                  </div>

               )
            )}

         </div>

         {/* SELECTED VARIANT SUMMARY */}

         {selectedVariant && (

            <div className='mt-8 bg-[#f7f7f7] border border-gray-200 rounded-[30px] p-6'>

               <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-5'>

                  <div>

                     <h3 className='text-xl font-semibold text-black'>
                        Selected Variant
                     </h3>

                     <p className='text-gray-500 mt-2'>
                        {
                           selectedVariant.type
                        }
                        {' : '}
                        {
                           selectedVariant.value
                        }
                     </p>

                  </div>

                  <div className='flex items-center gap-4 flex-wrap'>

                     <div className='bg-white border border-gray-200 px-5 py-3 rounded-2xl shadow-sm'>

                        <p className='text-sm text-gray-400'>
                           Extra Price
                        </p>

                        <h4 className='text-2xl font-bold text-black mt-1'>
                           ₹
                           {
                              selectedVariant.additionalPrice ||
                              0
                           }
                        </h4>

                     </div>

                     <div className='bg-white border border-gray-200 px-5 py-3 rounded-2xl shadow-sm'>

                        <p className='text-sm text-gray-400'>
                           Stock
                        </p>

                        <h4 className='text-2xl font-bold text-black mt-1'>
                           {
                              selectedVariant.stock
                           }
                        </h4>

                     </div>

                  </div>

               </div>

            </div>

         )}

      </div>

   )

}

export default ProductVariants