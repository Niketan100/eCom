'use client'
import React from 'react'
import { useMutation } from '@tanstack/react-query'
import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance'
import { Link as Icon} from 'lucide-react'
import Link from 'next/link'
const InventoryPage = () => {

  const [page, setPage] = React.useState(1)
  const limit = 4
  const getInventoryMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.get('/products/get-products', {
        params: { page, limit },
      })
      return res.data
    },
    onSuccess: (data) => {
      console.log('Inventory Data:', data)
    },
    onError: (error) => {
      console.error('Failed to fetch inventory:', error)
    }
  })

  let inventory: any[] = [];
  const total_prodcuts = getInventoryMutation.data?.count || 0;
  const meta = getInventoryMutation.data?.meta

    if (getInventoryMutation.isSuccess) {
      inventory = getInventoryMutation.data.products.map((product: any) => ({
        id: product.id,
        name: product.name,
        category: product.category,
        price: `$${product.price.toFixed(2)}`,
        stock: product.stock,
        status: product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'
      }));
    }

   React.useEffect(() => {
      getInventoryMutation.mutate()
  }, [page])

  return (
    <div className='min-h-screen bg-[#f6f7fb] p-6'>

      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8'>

        <div>
          <h1 className='text-4xl font-bold tracking-tight text-black'>
            Inventory
          </h1>

          <p className='text-gray-500 mt-2'>
            Manage stock levels and monitor product availability.
          </p>
        </div>

        <button className='bg-black text-white px-5 py-3 rounded-2xl font-medium hover:bg-[#111] transition-all duration-200 w-fit'>
          + Add Product
        </button>

      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8'>

        <div className='bg-white border border-gray-200 rounded-[28px] p-6 shadow-sm'>
          <p className='text-sm text-gray-500'>
            Total Products
          </p>

          <h2 className='text-3xl font-bold text-black mt-2'>
            {total_prodcuts}
          </h2>
        </div>

        <div className='bg-white border border-gray-200 rounded-[28px] p-6 shadow-sm'>
          <p className='text-sm text-gray-500'>
            In Stock
          </p>

          <h2 className='text-3xl font-bold text-green-600 mt-2'>
            {total_prodcuts - inventory.filter(product => product.status === 'Low Stock' || product.status === 'Out of Stock').length}
          </h2>
        </div>

        <div className='bg-white border border-gray-200 rounded-[28px] p-6 shadow-sm'>
          <p className='text-sm text-gray-500'>
            Low Stock
          </p>

          <h2 className='text-3xl font-bold text-yellow-600 mt-2'>
            {inventory.filter(product => product.status === 'Low Stock').length}
          </h2>
        </div>

        <div className='bg-white border border-gray-200 rounded-[28px] p-6 shadow-sm'>
          <p className='text-sm text-gray-500'>
            Out of Stock
          </p>

          <h2 className='text-3xl font-bold text-red-600 mt-2'>
            {inventory.filter(product => product.status === 'Out of Stock').length}
          </h2>
        </div>

      </div>

      {/* Inventory Table */}
      <div className='bg-white border border-gray-200 rounded-[32px] p-6 shadow-sm'>

        {/* Top */}
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6'>

          <div>
            <h2 className='text-2xl font-bold text-black'>
              Product Inventory
            </h2>

            <p className='text-sm text-gray-500 mt-1'>
              Track all products and available stock.
            </p>
          </div>

          <div className='flex gap-3 flex-col sm:flex-row'>

            <input
              type='text'
              placeholder='Search products...'
              className='bg-[#f7f7f7] border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition-all'
            />

            <select className='bg-[#f7f7f7] border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition-all'>
              <option>All Products</option>
              <option>In Stock</option>
              <option>Low Stock</option>
              <option>Out of Stock</option>
            </select>

          </div>

        </div>

        {/* Table */}
        <div className='overflow-x-auto'>

          <table className='w-full min-w-[950px]'>

            <thead>
              <tr className='border-b border-gray-200 text-left'>

                <th className='pb-4 text-sm font-semibold text-gray-500'>
                  Product ID
                </th>

                <th className='pb-4 text-sm font-semibold text-gray-500'>
                  Product
                </th>

                <th className='pb-4 text-sm font-semibold text-gray-500'>
                  Category
                </th>

                <th className='pb-4 text-sm font-semibold text-gray-500'>
                  Price
                </th>

                <th className='pb-4 text-sm font-semibold text-gray-500'>
                  Stock
                </th>

                <th className='pb-4 text-sm font-semibold text-gray-500'>
                  Status
                </th>

                <th className='pb-4 text-sm font-semibold text-gray-500 text-right'>
                  Actions
                </th>

              </tr>
            </thead>

            <tbody>

              {inventory.map((product, index) => (
                <tr
                  key={index}
                  className='border-b border-gray-100 hover:bg-[#fafafa] transition-all'
                >

                  <td className='py-5 font-semibold text-black'>
                    {product.id}
                  </td>

                  <td className='py-5'>
                    <div className='flex items-center gap-4'>

                      <div className='w-14 h-14 rounded-2xl bg-[#f3f4f6] flex items-center justify-center text-2xl'>
                        📦
                      </div>

                      <div>
                        <h3 className='font-semibold text-black'>
                          {product.name}
                        </h3>
                      </div>

                    </div>
                  </td>

                  <td className='py-5 text-gray-600'>
                    {product.category}
                  </td>

                  <td className='py-5 font-semibold text-black'>
                    {product.price}
                  </td>

                  <td className='py-5 text-gray-600'>
                    {product.stock}
                  </td>

                  <td className='py-5'>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.status === 'In Stock'
                          ? 'bg-green-100 text-green-700'
                          : product.status === 'Low Stock'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>

                  <td className='py-5'>
                    <div className='flex justify-end gap-3'>

                            <Link href={`/dashboard/manage-products/edit-product/${product.id}`}>
                        <Icon className='inline-flex items-center gap-1' >
                            
                        </Icon>
                            </Link>

                      <button className='bg-black text-white px-4 py-2 rounded-xl hover:bg-[#111] transition-all duration-200'>
                        Update Stock
                      </button>

                    </div>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

        {/* Pagination */}
        <div className='flex items-center justify-between pt-6'>
          <p className='text-sm text-gray-500'>
            {meta ? (
              <>
                Page {meta.page} of {meta.totalPages} · Total {meta.total}
              </>
            ) : null}
          </p>

          <div className='flex items-center gap-3'>
            <button
              type='button'
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={getInventoryMutation.isPending || !meta?.hasPrev}
              className='px-4 py-2 rounded-xl border border-gray-200 bg-white text-black disabled:opacity-50'
            >
              Prev
            </button>
            <button
              type='button'
              onClick={() => setPage((p) => p + 1)}
              disabled={getInventoryMutation.isPending || !meta?.hasNext}
              className='px-4 py-2 rounded-xl bg-black text-white disabled:opacity-50'
            >
              Next
            </button>
          </div>
        </div>

      </div>

    </div>
  )
}

export default InventoryPage