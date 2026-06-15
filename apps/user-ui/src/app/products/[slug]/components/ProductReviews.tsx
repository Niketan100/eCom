'use client'

import React from 'react'

const ProductReviews = ({
   product
}: any) => {

   const reviews =
      product?.reviews || []

   const averageRating =
      product?.averageRating || 4.8

   const totalReviews =
      product?.reviewCount || 0

   return (

      <div className='bg-white border border-gray-200 rounded-[40px] p-8 shadow-sm mt-8'>

         {/* HEADER */}

         <div className='flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8 mb-10'>

            <div>

               <h2 className='text-3xl font-bold text-black'>
                  Customer Reviews
               </h2>

               <p className='text-gray-500 mt-2 text-lg'>
                  Real experiences from verified buyers
               </p>

            </div>

            <button className='bg-black text-white px-8 py-4 rounded-2xl font-semibold hover:bg-[#111] transition-all w-full xl:w-auto'>

               Write A Review

            </button>

         </div>

         {/* REVIEW SUMMARY */}

         <div className='grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-8'>

            {/* LEFT */}

            <div className='bg-[#f7f7f7] border border-gray-200 rounded-[32px] p-8'>

               <div className='text-center'>

                  <h2 className='text-7xl font-bold text-black'>
                     {averageRating}
                  </h2>

                  <div className='flex justify-center text-yellow-500 text-3xl mt-4'>
                     ★★★★★
                  </div>

                  <p className='text-gray-500 mt-4 text-lg'>
                     Based on
                     {' '}
                     {totalReviews}
                     {' '}
                     reviews
                  </p>

               </div>

               {/* RATING BARS */}

               <div className='mt-10 space-y-4'>

                  {[5, 4, 3, 2, 1].map(
                     (star) => (

                        <div
                           key={star}
                           className='flex items-center gap-4'
                        >

                           <span className='w-10 text-sm font-medium text-black'>
                              {star}
                              ★
                           </span>

                           <div className='flex-1 h-3 bg-gray-200 rounded-full overflow-hidden'>

                              <div
                                 className='h-full bg-black rounded-full'
                                 style={{
                                    width:
                                       star === 5
                                          ? '85%'
                                          : star === 4
                                          ? '60%'
                                          : star === 3
                                          ? '25%'
                                          : star === 2
                                          ? '10%'
                                          : '5%'
                                 }}
                              />

                           </div>

                        </div>

                     )
                  )}

               </div>

            </div>

            {/* RIGHT */}

            <div className='space-y-6'>

               {reviews.length > 0 ? (

                  reviews.map(
                     (
                        review: any,
                        index: number
                     ) => (

                        <div
                           key={index}
                           className='border border-gray-200 rounded-[32px] p-7 hover:shadow-lg transition-all'
                        >

                           {/* TOP */}

                           <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-5'>

                              <div className='flex items-center gap-4'>

                                 {/* AVATAR */}

                                 <div className='w-16 h-16 rounded-2xl bg-black text-white flex items-center justify-center text-2xl font-bold'>

                                    {review?.user?.name
                                       ?.charAt(
                                          0
                                       )
                                       ?.toUpperCase() ||
                                       'U'}

                                 </div>

                                 {/* INFO */}

                                 <div>

                                    <h3 className='text-xl font-semibold text-black'>
                                       {review
                                          ?.user
                                          ?.name ||
                                          'Anonymous User'}
                                    </h3>

                                    <div className='flex items-center gap-3 mt-2'>

                                       <div className='flex text-yellow-500'>
                                          {'★'.repeat(
                                             review.rating ||
                                                5
                                          )}
                                       </div>

                                       <span className='text-sm text-gray-400'>
                                          Verified Purchase
                                       </span>

                                    </div>

                                 </div>

                              </div>

                              {/* DATE */}

                              <div className='text-sm text-gray-400'>

                                 {new Date(
                                    review.createdAt
                                 ).toLocaleDateString()}

                              </div>

                           </div>

                           {/* REVIEW */}

                           <div className='mt-6'>

                              <p className='text-lg text-gray-600 leading-relaxed'>
                                 {review.comment}
                              </p>

                           </div>

                           {/* ACTIONS */}

                           <div className='mt-6 flex items-center gap-5 flex-wrap'>

                              <button className='bg-[#f3f4f6] hover:bg-black hover:text-white transition-all px-5 py-3 rounded-2xl text-sm font-medium'>

                                 Helpful

                              </button>

                              <button className='bg-[#f3f4f6] hover:bg-black hover:text-white transition-all px-5 py-3 rounded-2xl text-sm font-medium'>

                                 Reply

                              </button>

                           </div>

                        </div>

                     )
                  )

               ) : (

                  <div className='border border-dashed border-gray-300 rounded-[40px] p-16 text-center bg-[#fafafa]'>

                     <div className='text-[80px]'>
                        ⭐
                     </div>

                     <h3 className='text-3xl font-bold text-black mt-6'>
                        No Reviews Yet
                     </h3>

                     <p className='text-gray-500 mt-4 text-lg max-w-xl mx-auto'>
                        Be the first customer to share your experience with this product.
                     </p>

                     <button className='mt-8 bg-black text-white px-8 py-4 rounded-2xl font-semibold hover:bg-[#111] transition-all'>

                        Write First Review

                     </button>

                  </div>

               )}

            </div>

         </div>

         {/* REVIEW FOOTER */}

         <div className='mt-10 bg-[#fafafa] border border-gray-200 rounded-[32px] p-7 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6'>

            <div>

               <h3 className='text-2xl font-bold text-black'>
                  Verified Customer Feedback
               </h3>

               <p className='text-gray-500 mt-2 text-lg'>
                  Reviews are collected from customers who purchased this product.
               </p>

            </div>

            <div className='flex flex-wrap gap-4'>

               <div className='bg-white border border-gray-200 px-6 py-4 rounded-2xl shadow-sm'>

                  <p className='text-sm text-gray-400'>
                     Average Rating
                  </p>

                  <h3 className='text-2xl font-bold text-black mt-1'>
                     {averageRating}
                     /5
                  </h3>

               </div>

               <div className='bg-white border border-gray-200 px-6 py-4 rounded-2xl shadow-sm'>

                  <p className='text-sm text-gray-400'>
                     Total Reviews
                  </p>

                  <h3 className='text-2xl font-bold text-black mt-1'>
                     {totalReviews}
                  </h3>

               </div>

            </div>

         </div>

      </div>

   )

}

export default ProductReviews