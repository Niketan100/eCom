'use client'

import Link from 'next/link'
import React from 'react'
import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance'
import { useQuery } from '@tanstack/react-query'


const ManageProductsPage = () => {

  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await axiosInstance.get('/products/get-products')
      return response.data
    },
  })  

  if(isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-gray-500 text-lg'>Loading products...</p>
      </div>
    )
  }

  if(error) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-red-500 text-lg'>Failed to load products. Please try again.</p>
      </div>
    )
  }


  const products = data?.products || [];

  return (
    <div className='min-h-screen bg-[#f6f7fb] p-6'>

      {/* Header */}
      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8'>

        <div>
          <h1 className='text-4xl font-bold tracking-tight text-black'>
            Manage Products
          </h1>

          <p className='text-gray-500 mt-2'>
            Edit, manage, delete and monitor all your products.
          </p>
        </div>

        <button className='bg-black text-white px-5 py-3 rounded-2xl font-medium hover:bg-[#111] transition-all duration-200 w-fit'>
          + Add New Product
        </button>

      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8'>

        <div className='bg-white border border-gray-200 rounded-[28px] p-6 shadow-sm'>
          <p className='text-sm text-gray-500'>
            Total Products
          </p>

          <h2 className='text-3xl font-bold text-black mt-2'>
            {products.length}
          </h2>
        </div>

        <div className='bg-white border border-gray-200 rounded-[28px] p-6 shadow-sm'>
          <p className='text-sm text-gray-500'>
            {products.filter((p: any) => p.status === 'Active').length} Active Products
          </p>

          <h2 className='text-3xl font-bold text-green-600 mt-2'>
            {products.filter((p: any) => p.status === 'Active').length}
          </h2>
        </div>

        <div className='bg-white border border-gray-200 rounded-[28px] p-6 shadow-sm'>
          <p className='text-sm text-gray-500'>
            {products.filter((p: any) => p.stock < 10).length} Low Stock
          </p>

          <h2 className='text-3xl font-bold text-yellow-600 mt-2'>
            {products.filter((p: any) => p.stock < 10).length}
          </h2>
        </div>

        <div className='bg-white border border-gray-200 rounded-[28px] p-6 shadow-sm'>
          <p className='text-sm text-gray-500'>
            {products.filter((p: any) => p.stock === 0).length} Out of Stock
          </p>

          <h2 className='text-3xl font-bold text-red-600 mt-2'>
            {products.filter((p: any) => p.stock === 0).length}
          </h2>
        </div>

      </div>

      {/* Products */}
      <div className='bg-white border border-gray-200 rounded-[32px] p-6 shadow-sm'>

        {/* Top */}
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6'>

          <div>
            <h2 className='text-2xl font-bold text-black'>
              All Products
            </h2>

            <p className='text-sm text-gray-500 mt-1'>
              Manage all listed products from here.
            </p>
          </div>

          <div className='flex flex-col sm:flex-row gap-3'>

            <input
              type='text'
              placeholder='Search products...'
              className='bg-[#f7f7f7] border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition-all'
            />

            <select className='bg-[#f7f7f7] border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition-all'>
              <option>All Products</option>
              <option>Active</option>
              <option>Low Stock</option>
              <option>Out of Stock</option>
            </select>

          </div>

        </div>

        {/* Product Cards */}
        <div className='grid grid-cols-1 xl:grid-cols-2 gap-5'>

          {products.map((product: any, index: number) => (
            <div
              key={index}
              className='bg-[#fcfcfc] border border-gray-200 rounded-[30px] p-5 hover:shadow-md transition-all duration-200'
            >

              {/* Top */}
              <div className='flex items-start justify-between gap-4'>

                <div className='flex items-center gap-4'>

                  <div className='w-20 h-20 rounded-[24px] bg-[#f3f4f6] flex items-center justify-center text-4xl'>
                    📦
                  </div>

                  <div>

                    <h3 className='text-xl font-bold text-black'>
                      {product.name}
                    </h3>

                    <p className='text-sm text-gray-500 mt-1'>
                      {product.category}
                    </p>

                    <div className='flex items-center gap-3 mt-3'>

                      <span className='text-lg font-bold text-black'>
                        {product.price}
                      </span>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          product.status === 'Active'
                            ? 'bg-green-100 text-green-700'
                            : product.status === 'Low Stock'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {product.status}
                      </span>

                    </div>

                  </div>

                </div>

                <button className='bg-[#f3f4f6] hover:bg-[#e5e7eb] transition-all w-11 h-11 rounded-2xl flex items-center justify-center text-lg'>
                  ⋮
                </button>

              </div>

              {/* Details */}
              <div className='grid grid-cols-2 gap-4 mt-6'>

                <div className='bg-white border border-gray-200 rounded-2xl p-4'>
                  <p className='text-sm text-gray-500'>
                    Stock
                  </p>

                  <h3 className='text-2xl font-bold text-black mt-1'>
                    {product.stock}
                  </h3>
                </div>

                <div className='bg-white border border-gray-200 rounded-2xl p-4'>
                  <p className='text-sm text-gray-500'>
                    Total Sales
                  </p>

                  <h3 className='text-2xl font-bold text-black mt-1'>
                    {product.sales}
                  </h3>
                </div>

              </div>

              {/* Actions */}
              <div className='flex flex-wrap gap-3 mt-6'>
                {(() => {
                  const editId = (product?.id ?? '').toString();
                  const editHref = editId
                    ? `/dashboard/manage-products/edit-product/${encodeURIComponent(editId)}`
                    : '';
                  return editHref ? (
                    <Link
                      href={`/dashboard/manage-products/edit-product/${product.id}`}
                      className='flex-1 bg-black text-white py-3 rounded-2xl hover:bg-[#111] transition-all duration-200 font-medium text-center'
                    >
                      Edit Product
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className='flex-1 bg-gray-200 text-gray-500 py-3 rounded-2xl font-medium text-center cursor-not-allowed'
                    >
                      Edit Product
                    </button>
                  )
                })()}

                <button className='flex-1 bg-[#f3f4f6] text-black py-3 rounded-2xl hover:bg-[#e5e7eb] transition-all duration-200 font-medium'>
                  Update Stock
                </button>

                <button className='w-full bg-red-50 text-red-600 py-3 rounded-2xl hover:bg-red-100 transition-all duration-200 font-medium'>
                  Delete Product
                </button>

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  )
}

export default ManageProductsPage