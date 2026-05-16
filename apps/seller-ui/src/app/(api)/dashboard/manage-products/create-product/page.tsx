'use client'

import React from 'react'
import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance'

import { useForm } from 'react-hook-form'

import { useMutation } from '@tanstack/react-query'

type ProductFormData = {
   name: string
   description: string
   category: string
   price: number
   stock: number
}

const CreateProduct = () => {
    const submitMutation =  useMutation({
    mutationFn: async (data: ProductFormData) => {
        const res = await axiosInstance.post('/products/create-product', data)
        return res.data
    },
    onSuccess : () => {
        alert('Product created successfully!')
    },
    onError: () => {
        alert('Failed to create product. Please try again.')
    }
})

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors, isSubmitting }
   } = useForm<ProductFormData>()


    const onSubmit = async (data: ProductFormData) => {
        try {
            await submitMutation.mutateAsync(data)
            alert('Product created successfully!')
            reset()
        } catch (error) {
            alert('Failed to create product. Please try again.')
        }
    }

   return (

      <div className='min-h-screen bg-[#0a0a0a] p-6'>

         <div className='max-w-3xl mx-auto bg-[#111] border border-white/10 rounded-3xl p-8'>

            <div className='mb-8'>

               <h1 className='text-3xl font-bold text-white'>
                  Create Product
               </h1>

               <p className='text-gray-400 mt-2'>
                  Add a new product to your store
               </p>

            </div>

            <form
               onSubmit={handleSubmit(onSubmit)}
               className='flex flex-col gap-6'
            >

               {/* Product Name */}

               <div>

                  <label className='text-sm text-gray-300 mb-2 block'>
                     Product Name
                  </label>

                  <input
                     type='text'
                     placeholder='Wireless Headphones'
                     className='w-full bg-[#181818] border border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:border-white/30 transition-all'
                     {...register('name', {
                        required: 'Product name is required',
                        minLength: {
                           value: 3,
                           message: 'Minimum 3 characters'
                        }
                     })}
                  />

                  {errors.name && (
                     <p className='text-red-400 text-sm mt-2'>
                        {errors.name.message}
                     </p>
                  )}

               </div>

               {/* Description */}

               <div>

                  <label className='text-sm text-gray-300 mb-2 block'>
                     Description
                  </label>

                  <textarea
                     rows={5}
                     placeholder='Write product description'
                     className='w-full bg-[#181818] border border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:border-white/30 transition-all resize-none'
                     {...register('description', {
                        required: 'Description is required'
                     })}
                  />

                  {errors.description && (
                     <p className='text-red-400 text-sm mt-2'>
                        {errors.description.message}
                     </p>
                  )}

               </div>

               {/* Category */}

               <div>

                  <label className='text-sm text-gray-300 mb-2 block'>
                     Category
                  </label>

                  <input
                     type='text'
                     placeholder='Electronics'
                     className='w-full bg-[#181818] border border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:border-white/30 transition-all'
                     {...register('category', {
                        required: 'Category is required'
                     })}
                  />

                  {errors.category && (
                     <p className='text-red-400 text-sm mt-2'>
                        {errors.category.message}
                     </p>
                  )}

               </div>

               {/* Price + Stock */}

               <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>

                  <div>

                     <label className='text-sm text-gray-300 mb-2 block'>
                        Price
                     </label>

                     <input
                        type='number'
                        placeholder='2999'
                        className='w-full bg-[#181818] border border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:border-white/30 transition-all'
                        {...register('price', {
                           required: 'Price is required',
                           min: {
                              value: 1,
                              message: 'Price must be greater than 0'
                           }
                        })}
                     />

                     {errors.price && (
                        <p className='text-red-400 text-sm mt-2'>
                           {errors.price.message}
                        </p>
                     )}

                  </div>

                  <div>

                     <label className='text-sm text-gray-300 mb-2 block'>
                        Stock
                     </label>

                     <input
                        type='number'
                        placeholder='10'
                        className='w-full bg-[#181818] border border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:border-white/30 transition-all'
                        {...register('stock', {
                           required: 'Stock is required',
                           min: {
                              value: 0,
                              message: 'Stock cannot be negative'
                           }
                        })}
                     />

                     {errors.stock && (
                        <p className='text-red-400 text-sm mt-2'>
                           {errors.stock.message}
                        </p>
                     )}

                  </div>

               </div>

               {/* Submit */}

               <button
                  type='submit'
                  disabled={isSubmitting}
                  className='bg-white text-black py-4 rounded-2xl font-semibold hover:bg-gray-200 transition-all disabled:opacity-50'
               >

                  {isSubmitting
                     ? 'Creating Product...'
                     : 'Create Product'}

               </button>

            </form>

         </div>

      </div>

   )
}

export default CreateProduct