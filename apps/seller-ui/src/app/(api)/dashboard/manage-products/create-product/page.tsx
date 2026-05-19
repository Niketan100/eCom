'use client'

import React from 'react'

import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance'

import { useForm } from 'react-hook-form'

import { useMutation } from '@tanstack/react-query'

type ProductFormData = {

   name: string

   shortDescription: string

   description: string

   category: string

   brand: string

   price: number

   discountedPrice: number

   stock: number

   sku: string

   tags: string

   shippingWeight: string

   warranty: string

}

const CreateProductPage = () => {

   const {
      register,
      handleSubmit,
      reset
   } = useForm<ProductFormData>()

   const [features, setFeatures] =
      React.useState([
         {
            key: '',
            value: ''
         }
      ])

   const [highlights, setHighlights] =
      React.useState([''])

   const [variants, setVariants] =
      React.useState([
         {
            type: '',
            value: '',
            stock: '',
            additionalPrice: ''
         }
      ])

   const submitMutation = useMutation({

      mutationFn: async (
         data: ProductFormData
      ) => {

         const payload = {

            name: data.name,

            shortDescription:
               data.shortDescription,

            description:
               data.description,

            category:
               data.category,

            brand:
               data.brand,

            price:
               Number(data.price),

            discountedPrice:
               Number(
                  data.discountedPrice
               ) || null,

            stock:
               Number(data.stock),

            sku:
               data.sku,

            tags:
               data.tags
                  ?.split(',')
                  .map((tag) =>
                     tag.trim()
                  ) || [],

            shippingWeight:
               data.shippingWeight,

            warranty:
               data.warranty,

            highlights,

            features,

            variants

         }

         const res =
            await axiosInstance.post(
               '/products/create-product',
               payload
            )

         return res.data

      },

      onSuccess: () => {

         alert(
            'Product created successfully'
         )

         reset()

      }

   })

   const onSubmit = async (
      data: ProductFormData
   ) => {

      await submitMutation.mutateAsync(
         data
      )

   }

   return (

      <div className='min-h-screen bg-[#f6f7fb] p-8'>

         <div className='max-w-7xl mx-auto'>

            <div className='flex items-center justify-between mb-10'>

               <div>

                  <h1 className='text-4xl font-bold text-black'>
                     Create Product
                  </h1>

                  <p className='text-gray-500 mt-2'>
                     Create professional
                     ecommerce listings
                  </p>

               </div>

               <button
                  form='create-product'
                  type='submit'
                  className='bg-black text-white px-8 py-4 rounded-2xl'
               >

                  Publish Product

               </button>

            </div>

            <form
               id='create-product'
               onSubmit={handleSubmit(
                  onSubmit
               )}
               className='grid grid-cols-1 xl:grid-cols-3 gap-6'
            >

               {/* LEFT */}

               <div className='xl:col-span-2 space-y-6'>

                  {/* BASIC INFO */}

                  <div className='bg-white rounded-[32px] border border-gray-200 p-7'>

                     <h2 className='text-2xl font-bold mb-6'>
                        Product Information
                     </h2>

                     <div className='space-y-5'>

                        <input
                           type='text'
                           placeholder='Product Name'
                           className='w-full bg-[#f8f8f8] border border-gray-200 rounded-2xl px-5 py-4'
                           {...register('name')}
                        />

                        <input
                           type='text'
                           placeholder='Short Description'
                           className='w-full bg-[#f8f8f8] border border-gray-200 rounded-2xl px-5 py-4'
                           {...register(
                              'shortDescription'
                           )}
                        />

                        <textarea
                           rows={7}
                           placeholder='Description'
                           className='w-full bg-[#f8f8f8] border border-gray-200 rounded-2xl px-5 py-4 resize-none'
                           {...register(
                              'description'
                           )}
                        />

                     </div>

                  </div>

                  {/* FEATURES */}

                  <div className='bg-white rounded-[32px] border border-gray-200 p-7'>

                     <div className='flex items-center justify-between mb-6'>

                        <div>

                           <h2 className='text-2xl font-bold'>
                              Features
                           </h2>

                           <p className='text-gray-500 mt-1'>
                              Structured product
                              specifications
                           </p>

                        </div>

                        <button
                           type='button'
                           onClick={() =>
                              setFeatures([
                                 ...features,
                                 {
                                    key: '',
                                    value: ''
                                 }
                              ])
                           }
                           className='bg-black text-white px-5 py-3 rounded-2xl'
                        >

                           + Add

                        </button>

                     </div>

                     <div className='space-y-4'>

                        {features.map(
                           (
                              feature,
                              index
                           ) => (

                              <div
                                 key={index}
                                 className='grid grid-cols-2 gap-4'
                              >

                                 <input
                                    type='text'
                                    placeholder='Battery'
                                    value={
                                       feature.key
                                    }
                                    onChange={(e) => {

                                       const updated =
                                          [
                                             ...features
                                          ]

                                       updated[
                                          index
                                       ].key =
                                          e.target.value

                                       setFeatures(
                                          updated
                                       )

                                    }}
                                    className='bg-[#f8f8f8] border border-gray-200 rounded-2xl px-5 py-4'
                                 />

                                 <input
                                    type='text'
                                    placeholder='5000mAh'
                                    value={
                                       feature.value
                                    }
                                    onChange={(e) => {

                                       const updated =
                                          [
                                             ...features
                                          ]

                                       updated[
                                          index
                                       ].value =
                                          e.target.value

                                       setFeatures(
                                          updated
                                       )

                                    }}
                                    className='bg-[#f8f8f8] border border-gray-200 rounded-2xl px-5 py-4'
                                 />

                              </div>

                           )
                        )}

                     </div>

                  </div>

                  {/* HIGHLIGHTS */}

                  <div className='bg-white rounded-[32px] border border-gray-200 p-7'>

                     <div className='flex items-center justify-between mb-6'>

                        <div>

                           <h2 className='text-2xl font-bold'>
                              Highlights
                           </h2>

                           <p className='text-gray-500 mt-1'>
                              Marketing bullet
                              points
                           </p>

                        </div>

                        <button
                           type='button'
                           onClick={() =>
                              setHighlights([
                                 ...highlights,
                                 ''
                              ])
                           }
                           className='bg-black text-white px-5 py-3 rounded-2xl'
                        >

                           + Add

                        </button>

                     </div>

                     <div className='space-y-4'>

                        {highlights.map(
                           (
                              highlight,
                              index
                           ) => (

                              <input
                                 key={index}
                                 type='text'
                                 placeholder='Fast Charging'
                                 value={highlight}
                                 onChange={(e) => {

                                    const updated =
                                       [
                                          ...highlights
                                       ]

                                    updated[
                                       index
                                    ] =
                                       e.target.value

                                    setHighlights(
                                       updated
                                    )

                                 }}
                                 className='w-full bg-[#f8f8f8] border border-gray-200 rounded-2xl px-5 py-4'
                              />

                           )
                        )}

                     </div>

                  </div>

                  {/* VARIANTS */}

                  <div className='bg-white rounded-[32px] border border-gray-200 p-7'>

                     <div className='flex items-center justify-between mb-6'>

                        <div>

                           <h2 className='text-2xl font-bold'>
                              Variants
                           </h2>

                           <p className='text-gray-500 mt-1'>
                              Product options
                           </p>

                        </div>

                        <button
                           type='button'
                           onClick={() =>
                              setVariants([
                                 ...variants,
                                 {
                                    type: '',
                                    value: '',
                                    stock: '',
                                    additionalPrice:
                                       ''
                                 }
                              ])
                           }
                           className='bg-black text-white px-5 py-3 rounded-2xl'
                        >

                           + Add Variant

                        </button>

                     </div>

                     <div className='space-y-4'>

                        {variants.map(
                           (
                              variant,
                              index
                           ) => (

                              <div
                                 key={index}
                                 className='grid grid-cols-4 gap-4'
                              >

                                 <input
                                    type='text'
                                    placeholder='Color'
                                    value={
                                       variant.type
                                    }
                                    onChange={(e) => {

                                       const updated =
                                          [
                                             ...variants
                                          ]

                                       updated[
                                          index
                                       ].type =
                                          e.target.value

                                       setVariants(
                                          updated
                                       )

                                    }}
                                    className='bg-[#f8f8f8] border border-gray-200 rounded-2xl px-5 py-4'
                                 />

                                 <input
                                    type='text'
                                    placeholder='Black'
                                    value={
                                       variant.value
                                    }
                                    onChange={(e) => {

                                       const updated =
                                          [
                                             ...variants
                                          ]

                                       updated[
                                          index
                                       ].value =
                                          e.target.value

                                       setVariants(
                                          updated
                                       )

                                    }}
                                    className='bg-[#f8f8f8] border border-gray-200 rounded-2xl px-5 py-4'
                                 />

                                 <input
                                    type='number'
                                    placeholder='Stock'
                                    value={
                                       variant.stock
                                    }
                                    onChange={(e) => {

                                       const updated =
                                          [
                                             ...variants
                                          ]

                                       updated[
                                          index
                                       ].stock =
                                          e.target.value

                                       setVariants(
                                          updated
                                       )

                                    }}
                                    className='bg-[#f8f8f8] border border-gray-200 rounded-2xl px-5 py-4'
                                 />

                                 <input
                                    type='number'
                                    placeholder='Extra Price'
                                    value={
                                       variant.additionalPrice
                                    }
                                    onChange={(e) => {

                                       const updated =
                                          [
                                             ...variants
                                          ]

                                       updated[
                                          index
                                       ].additionalPrice =
                                          e.target.value

                                       setVariants(
                                          updated
                                       )

                                    }}
                                    className='bg-[#f8f8f8] border border-gray-200 rounded-2xl px-5 py-4'
                                 />

                              </div>

                           )
                        )}

                     </div>

                  </div>

               </div>

               {/* RIGHT */}

               <div className='space-y-6'>

                  <div className='bg-white rounded-[32px] border border-gray-200 p-7 space-y-5'>

                     <h2 className='text-2xl font-bold'>
                        Pricing
                     </h2>

                     <input
                        type='number'
                        placeholder='Price'
                        className='w-full bg-[#f8f8f8] border border-gray-200 rounded-2xl px-5 py-4'
                        {...register('price')}
                     />

                     <input
                        type='number'
                        placeholder='Discount Price'
                        className='w-full bg-[#f8f8f8] border border-gray-200 rounded-2xl px-5 py-4'
                        {...register(
                           'discountedPrice'
                        )}
                     />

                  </div>

                  <div className='bg-white rounded-[32px] border border-gray-200 p-7 space-y-5'>

                     <h2 className='text-2xl font-bold'>
                        Inventory
                     </h2>

                     <input
                        type='number'
                        placeholder='Stock'
                        className='w-full bg-[#f8f8f8] border border-gray-200 rounded-2xl px-5 py-4'
                        {...register('stock')}
                     />

                     <input
                        type='text'
                        placeholder='SKU'
                        className='w-full bg-[#f8f8f8] border border-gray-200 rounded-2xl px-5 py-4'
                        {...register('sku')}
                     />

                  </div>

                  <div className='bg-white rounded-[32px] border border-gray-200 p-7 space-y-5'>

                     <h2 className='text-2xl font-bold'>
                        Organization
                     </h2>

                     <input
                        type='text'
                        placeholder='Category'
                        className='w-full bg-[#f8f8f8] border border-gray-200 rounded-2xl px-5 py-4'
                        {...register(
                           'category'
                        )}
                     />

                     <input
                        type='text'
                        placeholder='Brand'
                        className='w-full bg-[#f8f8f8] border border-gray-200 rounded-2xl px-5 py-4'
                        {...register('brand')}
                     />

                     <input
                        type='text'
                        placeholder='Tags'
                        className='w-full bg-[#f8f8f8] border border-gray-200 rounded-2xl px-5 py-4'
                        {...register('tags')}
                     />

                  </div>

                  <div className='bg-white rounded-[32px] border border-gray-200 p-7 space-y-5'>

                     <h2 className='text-2xl font-bold'>
                        Shipping
                     </h2>

                     <input
                        type='text'
                        placeholder='Shipping Weight'
                        className='w-full bg-[#f8f8f8] border border-gray-200 rounded-2xl px-5 py-4'
                        {...register(
                           'shippingWeight'
                        )}
                     />

                     <input
                        type='text'
                        placeholder='Warranty'
                        className='w-full bg-[#f8f8f8] border border-gray-200 rounded-2xl px-5 py-4'
                        {...register(
                           'warranty'
                        )}
                     />

                  </div>

               </div>

            </form>

         </div>

      </div>

   )

}

export default CreateProductPage