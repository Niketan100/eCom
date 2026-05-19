'use client'

import React from 'react'
import Link from 'next/link'

const Footer = () => {

    return (

        <footer className='bg-black text-white mt-24 border-t border-white/10'>

            <div className='max-w-7xl mx-auto px-6 py-16'>

                {/* TOP */}

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12'>

                    {/* BRAND */}

                    <div>

                        <h2 className='text-3xl font-bold'>
                            Eshop
                        </h2>

                        <p className='text-gray-400 mt-5 leading-relaxed'>
                            Discover premium products from trusted sellers.
                            Shop smarter with a modern ecommerce experience.
                        </p>

                    </div>

                    {/* SHOP */}

                    <div>

                        <h3 className='text-lg font-semibold mb-5'>
                            Shop
                        </h3>

                        <div className='flex flex-col gap-4 text-gray-400'>

                            <Link
                                href='/products'
                                className='hover:text-white transition-all duration-200'
                            >
                                All Products
                            </Link>

                            <Link
                                href='/wishlist'
                                className='hover:text-white transition-all duration-200'
                            >
                                Wishlist
                            </Link>

                            <Link
                                href='/cart'
                                className='hover:text-white transition-all duration-200'
                            >
                                Cart
                            </Link>

                            <Link
                                href='/orders'
                                className='hover:text-white transition-all duration-200'
                            >
                                Orders
                            </Link>

                        </div>

                    </div>

                    {/* COMPANY */}

                    <div>

                        <h3 className='text-lg font-semibold mb-5'>
                            Company
                        </h3>

                        <div className='flex flex-col gap-4 text-gray-400'>

                            <Link
                                href='/about'
                                className='hover:text-white transition-all duration-200'
                            >
                                About Us
                            </Link>

                            <Link
                                href='/contact'
                                className='hover:text-white transition-all duration-200'
                            >
                                Contact
                            </Link>

                            <Link
                                href='/privacy-policy'
                                className='hover:text-white transition-all duration-200'
                            >
                                Privacy Policy
                            </Link>

                            <Link
                                href='/terms'
                                className='hover:text-white transition-all duration-200'
                            >
                                Terms & Conditions
                            </Link>

                        </div>

                    </div>

                    {/* NEWSLETTER */}

                    <div>

                        <h3 className='text-lg font-semibold mb-5'>
                            Stay Updated
                        </h3>

                        <p className='text-gray-400 mb-5'>
                            Get updates about new products and offers.
                        </p>

                        <div className='flex flex-col gap-3'>

                            <input
                                type='email'
                                placeholder='Enter your email'
                                className='bg-[#111] border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-white/30 transition-all'
                            />

                            <button className='bg-white text-black py-3 rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-200'>
                                Subscribe
                            </button>

                        </div>

                    </div>

                </div>

                {/* MIDDLE */}

                <div className='border-t border-white/10 mt-14 pt-10 flex flex-col lg:flex-row items-center justify-between gap-6'>

                    {/* SOCIALS */}

                    <div className='flex items-center gap-4'>

                        <button className='w-12 h-12 rounded-2xl bg-[#111] hover:bg-white hover:text-black transition-all duration-200'>
                            𝕏
                        </button>

                        <button className='w-12 h-12 rounded-2xl bg-[#111] hover:bg-white hover:text-black transition-all duration-200'>
                            ⓕ
                        </button>

                        <button className='w-12 h-12 rounded-2xl bg-[#111] hover:bg-white hover:text-black transition-all duration-200'>
                            ⓘ
                        </button>

                        <button className='w-12 h-12 rounded-2xl bg-[#111] hover:bg-white hover:text-black transition-all duration-200'>
                            ▶
                        </button>

                    </div>

                    {/* PAYMENT */}

                    <div className='flex items-center gap-4 text-gray-400 text-sm'>

                        <span className='bg-[#111] px-4 py-2 rounded-xl'>
                            VISA
                        </span>

                        <span className='bg-[#111] px-4 py-2 rounded-xl'>
                            Mastercard
                        </span>

                        <span className='bg-[#111] px-4 py-2 rounded-xl'>
                            UPI
                        </span>

                        <span className='bg-[#111] px-4 py-2 rounded-xl'>
                            PayPal
                        </span>

                    </div>

                </div>

                {/* BOTTOM */}

                <div className='border-t border-white/10 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500'>

                    <p>
                        © 2026 Eshop. All rights reserved.
                    </p>

                    <div className='flex items-center gap-6'>

                        <Link
                            href='/privacy-policy'
                            className='hover:text-white transition-all duration-200'
                        >
                            Privacy
                        </Link>

                        <Link
                            href='/terms'
                            className='hover:text-white transition-all duration-200'
                        >
                            Terms
                        </Link>

                        <Link
                            href='/cookies'
                            className='hover:text-white transition-all duration-200'
                        >
                            Cookies
                        </Link>

                    </div>

                </div>

            </div>

        </footer>

    )

}

export default Footer