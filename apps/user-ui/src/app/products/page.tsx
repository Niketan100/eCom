'use client'

import React from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'

import axiosInstance from '../../utils/axiosInstance'

const Page = () => {

    const {
        data,
        isLoading,
        isError
    } = useQuery({

        queryKey: ['products'],

        queryFn: async () => {

            const response =
                await axiosInstance.get('/products/get-all')
            return response.data

        }

    })

    const products = data?.products || []

    if (isLoading) {

        return (

            <div className='min-h-screen bg-[#f6f7fb] flex items-center justify-center'>

                <h1 className='text-2xl font-semibold text-black'>
                    Loading Products...
                </h1>

            </div>

        )

    }

    if (isError) {

        return (

            <div className='min-h-screen bg-[#f6f7fb] flex items-center justify-center'>

                <h1 className='text-2xl font-semibold text-red-500'>
                    Failed to load products
                </h1>

            </div>

        )

    }

    return (

        <div className='min-h-screen bg-[#f6f7fb]'>

            {/* HERO */}

            <section className='px-6 py-16'>

                <div className='max-w-7xl mx-auto'>

                    <div className='bg-black rounded-[40px] p-10 md:p-16 text-white overflow-hidden relative'>

                        <div className='max-w-2xl z-10 relative'>

                            <p className='text-sm uppercase tracking-[4px] text-gray-400 mb-4'>
                                Modern Marketplace
                            </p>

                            <h1 className='text-5xl md:text-6xl font-bold leading-tight'>
                                Discover Amazing Products
                            </h1>

                            <p className='text-gray-400 mt-6 text-lg leading-relaxed'>
                                Explore trending products from trusted sellers around the world.
                            </p>

                            <button className='mt-8 bg-white text-black px-6 py-4 rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-200'>
                                Shop Now
                            </button>

                        </div>

                    </div>

                </div>

            </section>

            {/* PRODUCTS */}

            <section className='px-6 pb-16'>

                <div className='max-w-7xl mx-auto'>

                    {/* HEADER */}

                    <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10'>

                        <div>

                            <h2 className='text-4xl font-bold text-black'>
                                Latest Products
                            </h2>

                            <p className='text-gray-500 mt-2'>
                                Browse recently added products.
                            </p>

                        </div>

                        <div className='flex gap-3'>

                            <input
                                type='text'
                                placeholder='Search products...'
                                className='bg-white border border-gray-200 rounded-2xl px-5 py-3 outline-none focus:border-black transition-all w-[250px]'
                            />

                            <select className='bg-white border border-gray-200 rounded-2xl px-5 py-3 outline-none focus:border-black transition-all'>

                                <option>
                                    All Categories
                                </option>

                            </select>

                        </div>

                    </div>

                    {/* GRID */}

                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>

                        {products.map((product: any) => (

                            <Link
                                key={product.id}
                                href={`/products/${product.slug}`}
                                className='group'
                            >

                                <div className='bg-white border border-gray-200 rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>

                                    {/* IMAGE */}

                                    <div className='h-[240px] bg-[#f3f4f6] flex items-center justify-center text-7xl'>

                                        📦

                                    </div>

                                    {/* CONTENT */}

                                    <div className='p-6'>

                                        <div className='flex items-center justify-between mb-3'>

                                            <span className='bg-black text-white text-xs px-3 py-1 rounded-full'>
                                                {product.category}
                                            </span>

                                            <span className='text-sm text-gray-500'>
                                                Stock: {product.stock}
                                            </span>

                                        </div>

                                        <h3 className='text-xl font-bold text-black line-clamp-1 group-hover:text-gray-700 transition-all'>

                                            {product.name}

                                        </h3>

                                        <p className='text-gray-500 text-sm mt-3 line-clamp-2'>

                                            {product.description}

                                        </p>

                                        <div className='flex items-center justify-between mt-6'>

                                            <h4 className='text-2xl font-bold text-black'>

                                                ₹{product.price}

                                            </h4>

                                            <button className='bg-black text-white px-4 py-2 rounded-xl hover:bg-[#111] transition-all duration-200'>

                                                View

                                            </button>

                                        </div>

                                    </div>

                                </div>

                            </Link>

                        ))}

                    </div>

                </div>

            </section>

        </div>

    )

}

export default Page