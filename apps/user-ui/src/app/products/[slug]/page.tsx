'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

import axiosInstance from '../../../utils/axiosInstance'

const ProductSlugPage = () => {

    const params = useParams()

    const slug = params.slug

    const {
        data,
        isLoading,
        isError
    } = useQuery({

        queryKey: ['single-product', slug],

        queryFn: async () => {

            const response = await axiosInstance.get(
                `/products/${slug}`
            )
            return response.data
        },

        enabled: !!slug

    })

    const product = data?.product

    if (isLoading) {

        return (

            <div className='min-h-screen bg-[#f6f7fb] flex items-center justify-center'>

                <h1 className='text-3xl font-bold text-black'>
                    Loading Product...
                </h1>

            </div>

        )

    }

    if (isError || !product) {

        return (

            <div className='min-h-screen bg-[#f6f7fb] flex flex-col items-center justify-center'>

                <h1 className='text-4xl font-bold text-black'>
                    Product Not Found
                </h1>

                <Link
                    href='/products'
                    className='mt-6 bg-black text-white px-6 py-3 rounded-2xl'
                >
                    Back To Products
                </Link>

            </div>

        )

    }

    return (

        <div className='min-h-screen bg-[#f6f7fb] px-6 py-10'>

            <div className='max-w-7xl mx-auto'>

                {/* BREADCRUMB */}

                <div className='mb-8 flex items-center gap-2 text-sm text-gray-500'>

                    <Link href='/products'>
                        Products
                    </Link>

                    <span>/</span>

                    <span className='text-black font-medium'>
                        {product.name}
                    </span>

                </div>

                {/* MAIN */}

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>

                    {/* IMAGE */}

                    <div className='bg-white border border-gray-200 rounded-[40px] shadow-sm overflow-hidden'>

                        <div className='h-[650px] flex items-center justify-center bg-[#f3f4f6]'>

                            <span className='text-[180px]'>
                                📦
                            </span>

                        </div>

                    </div>

                    {/* DETAILS */}

                    <div className='bg-white border border-gray-200 rounded-[40px] p-8 shadow-sm flex flex-col'>

                        {/* CATEGORY */}

                        <div className='mb-6'>

                            <span className='bg-black text-white px-4 py-2 rounded-full text-sm font-medium'>
                                {product.category}
                            </span>

                        </div>

                        {/* TITLE */}

                        <h1 className='text-5xl font-bold text-black leading-tight'>
                            {product.name}
                        </h1>

                        {/* DESCRIPTION */}

                        <p className='text-gray-500 text-lg leading-relaxed mt-6'>
                            {product.description}
                        </p>

                        {/* PRICE */}

                        <div className='mt-8 flex items-center gap-4'>

                            <h2 className='text-5xl font-bold text-black'>
                                ₹{product.price}
                            </h2>

                        </div>

                        {/* STOCK */}

                        <div className='mt-6'>

                            <span
                                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                    product.stock > 10
                                        ? 'bg-green-100 text-green-700'
                                        : product.stock > 0
                                        ? 'bg-yellow-100 text-yellow-700'
                                        : 'bg-red-100 text-red-700'
                                }`}
                            >

                                {product.stock > 10
                                    ? 'In Stock'
                                    : product.stock > 0
                                    ? 'Low Stock'
                                    : 'Out of Stock'}

                            </span>

                        </div>

                        {/* ACTIONS */}

                        <div className='mt-10 flex flex-col sm:flex-row gap-4'>

                            <button className='flex-1 bg-black text-white py-4 rounded-2xl font-semibold hover:bg-[#111] transition-all duration-200'>
                                Buy Now
                            </button>

                            <button className='flex-1 border border-black text-black py-4 rounded-2xl font-semibold hover:bg-black hover:text-white transition-all duration-200'>
                                Add To Wishlist
                            </button>

                        </div>

                        {/* EXTRA INFO */}

                        <div className='mt-10 border-t border-gray-200 pt-6'>

                            <div className='grid grid-cols-2 gap-6'>

                                <div>

                                    <p className='text-sm text-gray-500'>
                                        Product ID
                                    </p>

                                    <h3 className='font-semibold text-black mt-1 break-all'>
                                        {product.id}
                                    </h3>

                                </div>

                                <div>

                                    <p className='text-sm text-gray-500'>
                                        Created
                                    </p>

                                    <h3 className='font-semibold text-black mt-1'>
                                        {new Date(
                                            product.createdAt
                                        ).toLocaleDateString()}
                                    </h3>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    )

}

export default ProductSlugPage