'use client'

import React from 'react'

const ProductGallery = ({
   product
}: any) => {

   const [selectedImage, setSelectedImage] =
      React.useState(0)

   const images =
      product.images?.length > 0
         ? product.images
         : [
              {
                 url: null
              }
           ]

   return (

      <div className='space-y-5'>

         {/* MAIN IMAGE */}

         <div className='bg-white border border-gray-200 rounded-[40px] overflow-hidden shadow-sm'>

            <div className='h-[700px] bg-[#f5f5f5] relative group flex items-center justify-center overflow-hidden'>

               {images[selectedImage]
                  ?.url ? (

                  <img
                     src={
                        images[
                           selectedImage
                        ]?.url
                     }
                     alt={
                        product.name
                     }
                     className='w-full h-full object-cover group-hover:scale-105 transition-all duration-500'
                  />

               ) : (

                  <div className='flex flex-col items-center justify-center'>

                     <span className='text-[180px]'>
                        📦
                     </span>

                     <p className='text-gray-400 text-lg mt-5'>
                        No Product Image
                     </p>

                  </div>

               )}

               {/* BADGES */}

               <div className='absolute top-6 left-6 flex flex-col gap-3'>

                  {product.isFeatured && (

                     <span className='bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-semibold shadow-sm'>
                        Featured
                     </span>

                  )}

                  {product.discountedPrice && (

                     <span className='bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-sm'>
                        Sale
                     </span>

                  )}

               </div>

            </div>

         </div>

         {/* THUMBNAILS */}

         {images.length > 1 && (

            <div className='grid grid-cols-5 gap-4'>

               {images.map(
                  (
                     image: any,
                     index: number
                  ) => (

                     <button
                        key={index}
                        onClick={() =>
                           setSelectedImage(
                              index
                           )
                        }
                        className={`bg-white border rounded-[26px] overflow-hidden h-28 transition-all ${
                           selectedImage ===
                           index
                              ? 'border-black ring-2 ring-black'
                              : 'border-gray-200 hover:border-black'
                        }`}
                     >

                        {image.url ? (

                           <img
                              src={
                                 image.url
                              }
                              alt='thumbnail'
                              className='w-full h-full object-cover'
                           />

                        ) : (

                           <div className='w-full h-full bg-[#f5f5f5] flex items-center justify-center text-3xl'>
                              📦
                           </div>

                        )}

                     </button>

                  )
               )}

            </div>

         )}

         {/* IMAGE INFO */}

         <div className='bg-white border border-gray-200 rounded-[32px] p-6 shadow-sm'>

            <div className='grid grid-cols-2 md:grid-cols-4 gap-5'>

               <div>

                  <h3 className='text-sm text-gray-400 mb-2'>
                     Product ID
                  </h3>

                  <p className='font-semibold text-black'>
                     {product.id?.slice(
                        0,
                        10
                     )}
                  </p>

               </div>

               <div>

                  <h3 className='text-sm text-gray-400 mb-2'>
                     Category
                  </h3>

                  <p className='font-semibold text-black'>
                     {product.category}
                  </p>

               </div>

               <div>

                  <h3 className='text-sm text-gray-400 mb-2'>
                     Brand
                  </h3>

                  <p className='font-semibold text-black'>
                     {product.brand ||
                        'N/A'}
                  </p>

               </div>

               <div>

                  <h3 className='text-sm text-gray-400 mb-2'>
                     SKU
                  </h3>

                  <p className='font-semibold text-black'>
                     {product.sku ||
                        'N/A'}
                  </p>

               </div>

            </div>

         </div>

      </div>

   )

}

export default ProductGallery