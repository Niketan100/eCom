'use client'

import Link from 'next/link'
import React from 'react'
import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'


const ManageProductsPage = () => {

  const queryClient = useQueryClient()

  const [page, setPage] = React.useState(1)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)
  const limit = 10

  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      await axiosInstance.delete(`/products/delete/${productId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (err) => {
      console.error('Failed to delete product:', err)
    },
    onSettled: () => {
      setDeletingId(null)
    },
  })

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', page, limit],
    queryFn: async () => {
      const response = await axiosInstance.get('/products/get-products', {
        params: { page, limit },
      })
      return response.data
    },
    placeholderData: (prev) => prev,
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


  const products = data?.products || []
  const meta = data?.meta
  const total = typeof data?.total === 'number' ? data.total : products.length

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

        <Link
          href='/dashboard/manage-products/create-product'
          className='bg-black text-white px-5 py-3 rounded-2xl font-medium hover:bg-[#111] transition-all duration-200 w-fit'
        >
          + Add New Product
        </Link>

      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8'>

        <div className='bg-white border border-gray-200 rounded-[28px] p-6 shadow-sm'>
          <p className='text-sm text-gray-500'>
            Total Products
          </p>

          <h2 className='text-3xl font-bold text-black mt-2'>
            {total}
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

        {meta && (
          <div className='flex items-center justify-between gap-4 mb-6'>
            <p className='text-sm text-gray-500'>
              Page {meta.page} of {meta.totalPages} • Total {meta.total}
            </p>

            <div className='flex items-center gap-3'>
              <button
                type='button'
                disabled={!meta.hasPrev || isLoading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={
                  !meta.hasPrev || isLoading
                    ? 'px-4 py-2 rounded-xl bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'px-4 py-2 rounded-xl bg-[#f3f4f6] hover:bg-[#e5e7eb]'
                }
              >
                Prev
              </button>
              <button
                type='button'
                disabled={!meta.hasNext || isLoading}
                onClick={() => setPage((p) => p + 1)}
                className={
                  !meta.hasNext || isLoading
                    ? 'px-4 py-2 rounded-xl bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'px-4 py-2 rounded-xl bg-[#f3f4f6] hover:bg-[#e5e7eb]'
                }
              >
                Next
              </button>
            </div>
          </div>
        )}

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

                <button
                  type='button'
                  disabled={deleteMutation.isPending && deletingId === String(product.id)}
                  onClick={() => {
                    const ok = window.confirm('Delete this product? This action can\'t be undone.')
                    if (!ok) return
                    setDeletingId(String(product.id))
                    deleteMutation.mutate(String(product.id))
                  }}
                  className={
                    deleteMutation.isPending && deletingId === String(product.id)
                      ? 'w-full bg-red-50/60 text-red-300 py-3 rounded-2xl cursor-not-allowed transition-all duration-200 font-medium'
                      : 'w-full bg-red-50 text-red-600 py-3 rounded-2xl hover:bg-red-100 transition-all duration-200 font-medium'
                  }
                >
                  {deleteMutation.isPending && deletingId === String(product.id)
                    ? 'Deleting...'
                    : 'Delete Product'}
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