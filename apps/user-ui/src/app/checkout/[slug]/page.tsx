'use client'

import React from 'react'

import Link from 'next/link'

import { useParams, useSearchParams } from 'next/navigation'

import { useMutation, useQuery } from '@tanstack/react-query'

import axiosInstance from 'apps/user-ui/src/utils/axiosInstance'

const Page = () => {

   const params = useParams()

   const searchParams =
      useSearchParams()

   const slug = Array.isArray(params?.slug)
      ? params.slug[0]
      : (params?.slug as string)

   const qty =
      Number(
         searchParams.get('qty')
      ) || 1

   const variantIdRaw = searchParams.get('variant')
   const variantId = variantIdRaw && variantIdRaw.trim().length > 0 ? variantIdRaw : null

   const [addressForm, setAddressForm] = React.useState({
      fullName: '',
      phoneNumber: '',
      state: '',
      city: '',
      postalCode: '',
      landmark: '',
      fullAddress: '',
   })




   const {
      data,
      isLoading
   } = useQuery({

      queryKey: [
         'checkout-product',
         slug
      ],

      queryFn: async () => {

         const response =
            await axiosInstance.get(
               `/products/slug/${slug}`
            )

         return response.data.product

      },

      enabled: !!slug

   })
   // NOTE: avoid console.log here; it runs during Next build too

   const variant =
      variantId && Array.isArray(data?.variants)
         ? data.variants.find((v: any) => v?.id === variantId)
         : null

   // If a variant is selected, it typically overrides price/stock/etc.
   const product = variant ? { ...data, ...variant } : data




   const totalPrice =
      (product?.discountedPrice ||
         product?.price ||
         0) * qty

   const {
      mutate: placeOrder,
      isPending: isPlacingOrder,
      isSuccess: isPlaceSuccess,
      isError: isPlaceError,
      error: placeError,
   } = useMutation({
      mutationFn: async () => {
         // NOTE: product service route is mounted under /products
         // POST /products/orders/place
         const payload: any = {
            productId: product?.id,
            quantity: qty,
            address: [
               addressForm.fullName,
               addressForm.phoneNumber,
               addressForm.fullAddress,
               addressForm.landmark,
               addressForm.city,
               addressForm.state,
               addressForm.postalCode,
            ]
               .filter(Boolean)
               .join(', '),
         }

         if (variantId) payload.variantId = variantId

         const response = await axiosInstance.post('/products/orders/place', payload)
         return response.data
      },
   })

   const onPlaceOrder = () => {
      if (!product?.id) return

      if (!addressForm.fullName || !addressForm.phoneNumber || !addressForm.fullAddress) {
         // minimal validation for now
         alert('Please fill Full Name, Phone Number and Full Address')
         return
      }

      placeOrder()
   }

   if (isLoading) {

      return (

         <div className='min-h-screen flex items-center justify-center text-2xl font-semibold'>

            Loading checkout...

         </div>

      )

   }

   return (

      <div className='min-h-screen bg-[#f6f7fb] py-10 px-6'>

         <div className='max-w-7xl mx-auto'>

            {/* BREADCRUMB */}

            <div className='flex items-center gap-2 text-sm text-gray-500 mb-8'>

               <Link href='/products'>
                  Products
               </Link>

               <span>/</span>

               <Link
                  href={`/products/${slug}`}
               >
                  {product?.name}
               </Link>

               <span>/</span>

               <span className='text-black font-medium'>
                  Checkout
               </span>

            </div>

            {/* MAIN */}

            <div className='grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-8 items-start'>

               {/* LEFT */}

               <div className='space-y-8'>

                  {/* DELIVERY ADDRESS */}

                  <div className='bg-white border border-gray-200 rounded-[40px] p-8 shadow-sm'>

                     <h2 className='text-3xl font-bold text-black'>
                        Delivery Address
                     </h2>

                     <p className='text-gray-500 mt-2'>
                        Enter your shipping details
                     </p>

                     <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-8'>

                        <input
                           type='text'
                           placeholder='Full Name'
                           value={addressForm.fullName}
                           onChange={(e) => setAddressForm((p) => ({ ...p, fullName: e.target.value }))}
                           className='w-full border border-gray-200 bg-[#f7f7f7] rounded-2xl px-5 py-4 outline-none focus:border-black'
                        />

                        <input
                           type='text'
                           placeholder='Phone Number'
                           value={addressForm.phoneNumber}
                           onChange={(e) => setAddressForm((p) => ({ ...p, phoneNumber: e.target.value }))}
                           className='w-full border border-gray-200 bg-[#f7f7f7] rounded-2xl px-5 py-4 outline-none focus:border-black'
                        />

                        <input
                           type='text'
                           placeholder='State'
                           value={addressForm.state}
                           onChange={(e) => setAddressForm((p) => ({ ...p, state: e.target.value }))}
                           className='w-full border border-gray-200 bg-[#f7f7f7] rounded-2xl px-5 py-4 outline-none focus:border-black'
                        />

                        <input
                           type='text'
                           placeholder='City'
                           value={addressForm.city}
                           onChange={(e) => setAddressForm((p) => ({ ...p, city: e.target.value }))}
                           className='w-full border border-gray-200 bg-[#f7f7f7] rounded-2xl px-5 py-4 outline-none focus:border-black'
                        />

                        <input
                           type='text'
                           placeholder='Postal Code'
                           value={addressForm.postalCode}
                           onChange={(e) => setAddressForm((p) => ({ ...p, postalCode: e.target.value }))}
                           className='w-full border border-gray-200 bg-[#f7f7f7] rounded-2xl px-5 py-4 outline-none focus:border-black'
                        />

                        <input
                           type='text'
                           placeholder='Landmark'
                           value={addressForm.landmark}
                           onChange={(e) => setAddressForm((p) => ({ ...p, landmark: e.target.value }))}
                           className='w-full border border-gray-200 bg-[#f7f7f7] rounded-2xl px-5 py-4 outline-none focus:border-black'
                        />

                     </div>

                     <textarea
                        placeholder='Full Address'
                        value={addressForm.fullAddress}
                        onChange={(e) => setAddressForm((p) => ({ ...p, fullAddress: e.target.value }))}
                        className='w-full mt-5 border border-gray-200 bg-[#f7f7f7] rounded-2xl px-5 py-4 outline-none focus:border-black min-h-[140px]'
                     />

                  </div>

                  {/* PAYMENT */}

                  <div className='bg-white border border-gray-200 rounded-[40px] p-8 shadow-sm'>

                     <h2 className='text-3xl font-bold text-black'>
                        Payment Method
                     </h2>

                     <p className='text-gray-500 mt-2'>
                        Choose your preferred payment option
                     </p>

                     <div className='space-y-4 mt-8'>

                        <label className='flex items-center gap-4 border border-gray-200 rounded-2xl p-5 cursor-pointer hover:border-black transition-all'>

                           <input
                              type='radio'
                              name='payment'
                              defaultChecked
                           />

                           <div>

                              <h3 className='font-semibold text-black'>
                                 Cash On Delivery
                              </h3>

                              <p className='text-sm text-gray-500 mt-1'>
                                 Pay after receiving product
                              </p>

                           </div>

                        </label>

                        <label className='flex items-center gap-4 border border-gray-200 rounded-2xl p-5 cursor-pointer hover:border-black transition-all'>

                           <input
                              type='radio'
                              name='payment'
                           />

                           <div>

                              <h3 className='font-semibold text-black'>
                                 UPI Payment
                              </h3>

                              <p className='text-sm text-gray-500 mt-1'>
                                 Pay using PhonePe, GPay or Paytm
                              </p>

                           </div>

                        </label>

                        <label className='flex items-center gap-4 border border-gray-200 rounded-2xl p-5 cursor-pointer hover:border-black transition-all'>

                           <input
                              type='radio'
                              name='payment'
                           />

                           <div>

                              <h3 className='font-semibold text-black'>
                                 Credit / Debit Card
                              </h3>

                              <p className='text-sm text-gray-500 mt-1'>
                                 Visa, Mastercard, Rupay
                              </p>

                           </div>

                        </label>

                     </div>

                  </div>

               </div>

               {/* RIGHT */}

               <div className='sticky top-6'>

                {variantId ? (
                < div className='bg-white border border-gray-200 rounded-[40px] p-8 shadow-sm'>

                        <h2 className='text-3xl font-bold text-black'>
                           Variant Selected :
                        </h2>
                        <p className='text-gray-500 mt-2'>
                           {variantId ? 'Selected' : 'None'}
                        </p>

                        <h2 className='text-xl font-bold text-black'>
                           {product.type}
                        </h2>
                         <h2 className='text-xl font-bold text-black'>
                           {product.value}
                        </h2>
                        

                   

                        </div>
                ):(
                    <div>

                    </div>
                )}   
                


                  <div className='bg-white border border-gray-200 rounded-[40px] p-8 shadow-sm'>

                     <h2 className='text-3xl font-bold text-black'>
                        Order Summary
                     </h2>

                     {/* PRODUCT */}

                     <div className='flex gap-5 mt-8'>

                        <div className='w-28 h-28 rounded-[28px] overflow-hidden bg-[#f5f5f5] flex-shrink-0'>

                           {product?.images?.[0]
                              ?.url ? (

                              <img
                                 src={
                                    product
                                       .images[0]
                                       .url
                                 }
                                 alt={
                                    product.name
                                 }
                                 className='w-full h-full object-cover'
                              />

                           ) : (

                              <div className='w-full h-full flex items-center justify-center text-4xl'>
                                 📦
                              </div>

                           )}

                        </div>

                        <div className='flex-1'>

                           <h3 className='text-xl font-bold text-black leading-snug'>
                              {product?.name}
                           </h3>

                           <p className='text-gray-500 mt-2'>
                              Qty:
                              {' '}
                              {qty}
                           </p>

                           <h4 className='text-2xl font-bold text-black mt-4'>
                              ₹
                              {
                                 product?.discountedPrice ||
                                 product?.price
                              }
                           </h4>

                        </div>

                     </div>

                     {/* BILLING */}

                     <div className='border-t border-gray-200 mt-8 pt-8 space-y-5'>

                        <div className='flex items-center justify-between text-gray-600'>

                           <span>
                              Subtotal
                           </span>

                           <span>
                              ₹
                              {
                                 totalPrice
                              }
                           </span>

                        </div>

                        <div className='flex items-center justify-between text-gray-600'>

                           <span>
                              Shipping
                           </span>

                           <span>
                              Free
                           </span>

                        </div>

                        <div className='flex items-center justify-between text-gray-600'>

                           <span>
                              Taxes
                           </span>

                           <span>
                              ₹0
                           </span>

                        </div>

                     </div>

                     {/* TOTAL */}

                     <div className='border-t border-gray-200 mt-8 pt-8 flex items-center justify-between'>

                        <h3 className='text-2xl font-bold text-black'>
                           Total
                        </h3>

                        <h2 className='text-4xl font-bold text-black'>
                           ₹
                           {
                              totalPrice
                           }
                        </h2>

                     </div>

                     {/* BUTTON */}

                     {(isPlaceSuccess || isPlaceError) && (
                        <div className='mt-6'>
                           {isPlaceSuccess && (
                              <div className='bg-green-50 text-green-700 border border-green-200 rounded-2xl px-4 py-3'>
                                 Order placed successfully (Cash on Delivery).
                              </div>
                           )}
                           {isPlaceError && (
                              <div className='bg-red-50 text-red-700 border border-red-200 rounded-2xl px-4 py-3'>
                                 Failed to place order{placeError ? `: ${(placeError as any)?.message ?? ''}` : ''}
                              </div>
                           )}
                        </div>
                     )}

                     <button
                        className={`w-full mt-8 bg-black text-white py-5 rounded-2xl font-semibold transition-all text-lg ${
                           isPlacingOrder ? 'opacity-60 cursor-not-allowed' : 'hover:bg-[#111]'
                        }`}
                        onClick={() => onPlaceOrder()}
                        disabled={isPlacingOrder}
                     >

                        {isPlacingOrder ? 'Placing Order...' : 'Place Order'}

                     </button>

                  </div>

               </div>

            </div>

         </div>

      </div>

   )

}

export default Page