'use client'

import React from 'react'

import Link from 'next/link'

const BasicProductLayout = ({
   product
}: any) => {

   const [showDescription, setShowDescription] =
      React.useState(false)

   const [quantity, setQuantity] =
      React.useState(1)

   console.log('Product in BasicProductLayout:', product)

   const shouldClampDescription = false;
      // product.description?.length > 220

   return (

      <div className='min-h-screen bg-[#f6f7fb] py-10 px-6'>

         <div className='max-w-7xl mx-auto'>

            {/* BREADCRUMB */}

            <div className='flex items-center gap-2 text-sm text-gray-500 mb-8'>

               <Link href='/products'>
                  Products
               </Link>

               <span>/</span>

               <span className='text-black font-medium'>
                  {product.name}
               </span>

            </div>

            {/* HERO SECTION */}

            <div className='grid grid-cols-1 xl:grid-cols-2 gap-8 items-stretch'>

               {/* IMAGE SECTION */}

               <div className='bg-white border border-gray-200 rounded-[40px] overflow-hidden shadow-sm h-[760px]'>

                  <div className='h-full bg-[#f5f5f5] relative overflow-hidden flex items-center justify-center'>

                     {product.images?.[0]?.url ? (

                        <img
                           src={product.images[0].url}
                           alt={product.name}
                           className='w-full h-full object-cover'
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

                        {product.stock > 0 && (

                           <span className='bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-sm'>
                              In Stock
                           </span>

                        )}

                     </div>

                  </div>

               </div>

               {/* INFO SECTION */}

               <div className='bg-white border border-gray-200 rounded-[40px] p-8 shadow-sm h-[760px] flex flex-col justify-between'>

                  {/* TOP */}

                  <div>

                     {/* CATEGORY */}

                     <div className='flex flex-wrap items-center gap-3 mb-6'>

                        <span className='bg-black text-white px-4 py-2 rounded-full text-sm font-medium'>
                           {product.category}
                        </span>

                        {product.brand && (

                           <span className='bg-[#f3f4f6] text-black px-4 py-2 rounded-full text-sm font-medium'>
                              {product.brand}
                           </span>

                        )}

                     </div>

                     {/* TITLE */}

                     <h1 className='text-5xl font-bold text-black leading-tight'>

                        {product.name}

                     </h1>

                     {/* SHORT DESCRIPTION */}

                     {product.shortDescription && (

                        <p className='text-xl text-gray-500 mt-5 leading-relaxed'>

                           {product.shortDescription}

                        </p>

                     )}

                     {/* TAGS */}

                     {product.tags?.length > 0 && (

                        <div className='flex flex-wrap gap-3 mt-6'>

                           {product.tags.map(
                              (
                                 tag: string,
                                 index: number
                              ) => (

                                 <span
                                    key={index}
                                    className='bg-[#f3f4f6] text-gray-600 px-4 py-2 rounded-full text-sm'
                                 >

                                    #{tag}

                                 </span>

                              )
                           )}

                        </div>

                     )}

                     {/* RATING */}

                     <div className='flex items-center gap-4 mt-8'>

                        <div className='flex text-yellow-500 text-2xl'>
                           ★★★★★
                        </div>

                        <span className='text-gray-500 text-lg'>

                           {product.averageRating || 4.8}
                           /5 Rating

                        </span>

                        <span className='text-gray-400'>

                           ({product.reviewCount || 0} reviews)

                        </span>

                     </div>

                     {/* PRICE */}

                     <div className='mt-8 flex items-center gap-5 flex-wrap'>

                        <h2 className='text-6xl font-bold text-black'>
                           ₹{product.price}
                        </h2>

                        {product.discountedPrice && (

                           <>

                              <span className='text-3xl text-gray-400 line-through'>

                                 ₹{product.discountedPrice}

                              </span>

                              <span className='bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold'>
                                 Sale
                              </span>

                           </>

                        )}

                     </div>

                     {/* STOCK */}

                     <div className='mt-8 flex items-center gap-4'>

                        <span
                           className={`px-4 py-2 rounded-full text-sm font-semibold ${
                              product.stock > 0
                                 ? 'bg-green-100 text-green-700'
                                 : 'bg-red-100 text-red-700'
                           }`}
                        >

                           {product.stock > 0
                              ? 'In Stock'
                              : 'Out Of Stock'}

                        </span>

                        <span className='text-gray-500'>

                           {product.stock}
                           {' '}
                           items available

                        </span>

                     </div>

                     {/* QUANTITY */}

                     <div className='mt-10'>

                        <div className='flex items-center justify-between mb-4'>

                           <h3 className='text-2xl font-bold text-black'>
                              Quantity
                           </h3>

                           <span className='text-gray-500'>
                              Max:
                              {' '}
                              {product.stock}
                           </span>

                        </div>

                        <div className='flex items-center gap-4'>

                           <button
                              onClick={() =>
                                 setQuantity((prev) =>
                                    prev > 1
                                       ? prev - 1
                                       : 1
                                 )
                              }
                              className='w-14 h-14 rounded-2xl bg-[#f3f4f6] hover:bg-black hover:text-white transition-all text-2xl font-bold'
                           >

                              -

                           </button>

                           <div className='w-20 h-14 rounded-2xl bg-[#f3f4f6] flex items-center justify-center text-xl font-semibold'>

                              {quantity}

                           </div>

                           <button
                              onClick={() =>
                                 setQuantity((prev) =>
                                    prev < product.stock
                                       ? prev + 1
                                       : prev
                                 )
                              }
                              className='w-14 h-14 rounded-2xl bg-[#f3f4f6] hover:bg-black hover:text-white transition-all text-2xl font-bold'
                           >

                              +

                           </button>

                        </div>

                     </div>

                  </div>

                  {/* BUTTONS */}

                  <div className='pt-8 border-t border-gray-200 mt-8'>

                     <div className='flex flex-col xl:flex-row gap-4'>

                        <Link
                           href={`/checkout/${product.slug}?qty=${quantity}`}
                           className='flex-1'
                        >

                           <button className='w-full bg-black text-white py-5 rounded-2xl font-semibold hover:bg-[#111] transition-all text-lg'>

                              Buy Now

                           </button>

                        </Link>

                        <button className='flex-1 border border-black text-black py-5 rounded-2xl font-semibold hover:bg-black hover:text-white transition-all text-lg'>

                           Add To Wishlist

                        </button>

                     </div>

                  </div>

               </div>

            </div>

            {/* PRODUCT DETAILS SECTION */}

            <div className='space-y-8 mt-8'>

               {/* DESCRIPTION */}

               <div className='bg-white border border-gray-200 rounded-[40px] p-8 shadow-sm'>

                  <div className='flex items-center justify-between mb-6'>

                     <h2 className='text-3xl font-bold text-black'>
                        Product Description
                     </h2>

                     {
                        shouldClampDescription && (

                           <button
                              onClick={() =>
                                 setShowDescription(true)
                              }
                              className='text-sm font-semibold text-black hover:underline'
                           >

                              Expand

                           </button>

                        )
                     }

                  </div>

                  <p
                     className={`text-lg text-gray-600 leading-loose ${
                        shouldClampDescription
                           ? 'line-clamp-6'
                           : ''
                     }`}
                  >

                     {product.description}

                  </p>

               </div>

               {/* SHIPPING + SELLER */}

               <div className='grid grid-cols-1 xl:grid-cols-2 gap-8'>

                  {/* SHIPPING */}

                  <div className='bg-white border border-gray-200 rounded-[40px] p-8 shadow-sm'>

                     <div className='flex items-center justify-between mb-8'>

                        <h2 className='text-3xl font-bold text-black'>
                           Shipping Information
                        </h2>

                        <div className='w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center text-2xl'>
                           🚚
                        </div>

                     </div>

                     <div className='space-y-5'>

                        <div className='bg-[#f7f7f7] rounded-[28px] p-5'>

                           <p className='text-sm text-gray-400'>
                              Delivery
                           </p>

                           <h3 className='text-xl font-semibold text-black mt-2'>
                              3 - 5 Business Days
                           </h3>

                        </div>

                        <div className='bg-[#f7f7f7] rounded-[28px] p-5'>

                           <p className='text-sm text-gray-400'>
                              Warranty
                           </p>

                           <h3 className='text-xl font-semibold text-black mt-2'>
                              {product.warranty ||
                                 'No Warranty'}
                           </h3>

                        </div>

                        <div className='bg-[#f7f7f7] rounded-[28px] p-5'>

                           <p className='text-sm text-gray-400'>
                              Weight
                           </p>

                           <h3 className='text-xl font-semibold text-black mt-2'>
                              {product.shippingWeight ||
                                 'N/A'}
                           </h3>

                        </div>

                     </div>

                  </div>

                  {/* SELLER */}

                  <div className='bg-white border border-gray-200 rounded-[40px] p-8 shadow-sm flex flex-col justify-between'>

                     <div>

                        <div className='flex items-center justify-between mb-8'>

                           <h2 className='text-3xl font-bold text-black'>
                              Seller Information
                           </h2>

                           <div className='w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center text-2xl'>
                              🏪
                           </div>

                        </div>

                        <div className='flex items-center gap-5'>

                           <div className='w-24 h-24 rounded-[30px] bg-black text-white flex items-center justify-center text-4xl font-bold flex-shrink-0'>

                              {product?.shop?.name
                                 ?.charAt(0)
                                 ?.toUpperCase() || 'S'}

                           </div>

                           <div>

                              <h3 className='text-2xl font-bold text-black'>
                                 {product?.shop?.name ||
                                    'Official Store'}
                              </h3>

                              <p className='text-gray-500 mt-2'>
                                 Verified Marketplace Seller
                              </p>

                              <div className='flex items-center gap-3 mt-4'>

                                 <span className='bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium'>
                                    Trusted Seller
                                 </span>

                                 <span className='text-gray-400 text-sm'>
                                    ⭐ 4.8
                                 </span>

                              </div>

                           </div>

                        </div>

                     </div>

                     <button className='w-full mt-10 border border-black text-black py-4 rounded-2xl font-semibold hover:bg-black hover:text-white transition-all'>

                        Visit Store

                     </button>

                  </div>

               </div>

            </div>

            {/* DESCRIPTION MODAL */}

            {
               showDescription && (

                  <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6'>

                     <div className='bg-white w-full max-w-4xl rounded-[40px] p-10 max-h-[90vh] overflow-y-auto relative'>

                        <button
                           onClick={() =>
                              setShowDescription(false)
                           }
                           className='absolute top-6 right-6 w-12 h-12 rounded-full bg-[#f3f4f6] hover:bg-black hover:text-white transition-all'
                        >

                           ✕

                        </button>

                        <h2 className='text-4xl font-bold text-black mb-8'>
                           Product Description
                        </h2>

                        <div className='text-lg text-gray-600 leading-loose whitespace-pre-line'>

                           {product.description}

                        </div>

                     </div>

                  </div>

               )
            }

         </div>

      </div>

   )

}

export default BasicProductLayout