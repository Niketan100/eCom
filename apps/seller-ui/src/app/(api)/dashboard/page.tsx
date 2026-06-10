"use client";

import { items } from 'apps/seller-ui/src/configs/constants';
import useOrder from 'apps/seller-ui/src/hooks/useOrder';
import useProducts from 'apps/seller-ui/src/hooks/useProducts';
import type { SellerProduct } from 'apps/seller-ui/src/hooks/useProducts'
import { NumericKeys } from 'node_modules/react-hook-form/dist/types/path/common';



export default function SellerDashboard() {

  const {
  ordersCountDaywise = [],
  orders,
  isLoading: ordersLoading,
  error: ordersError,
  revenue,
  total_orders,
  percentage_order_today,
  percentage_revenue_today,
  total_customers,
  percentage_customers_today,
} = useOrder();

const maxOrders = Math.max(
  ...ordersCountDaywise.map((item: any) => item.orders),
  1
);

  const { products, lowStockProducts, isLoading: productsLoading, error: productsError } = useProducts();
  const stats = [
    {
      title: 'Total Revenue',
      value: revenue ? `₹${revenue.toLocaleString()}` : '₹0',
      change: percentage_revenue_today ? `+${percentage_revenue_today}% today` : 'No change today',
      icon: '💰',
    },
    {
      title: 'Orders',
      value: total_orders ? total_orders.toString() : '0',
      change: percentage_order_today ? `+${percentage_order_today}% today` : 'No change today',
      icon: '📦',
    },
    {
      title: 'Products',
      value: products ? products.length.toString() : '0',
      change: '',
      icon: '🛍️',
    },
    {
      title: 'Customers',
      value: total_customers ? total_customers.toString() : '0',
      change: `+${percentage_customers_today}% today`,
      icon: '👥',
    },
  ];

  const recentOrders = (orders ?? []).slice(0, 6);

  return (
    <div className='min-h-screen bg-[#f6f7fb] p-6 text-black'>
      <div className='max-w-7xl mx-auto'>

        {/* Header */}
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8'>
          <div>
            <h1 className='text-4xl font-bold tracking-tight'>
              Seller Dashboard
            </h1>

            <p className='text-gray-500 mt-2'>
              Welcome back, manage your store smoothly.
            </p>
          </div>

          <div className='flex items-center gap-3'>
            <button className='bg-white border border-gray-200 px-5 py-3 rounded-2xl font-medium hover:shadow-md transition-all'>
              Export Report
            </button>

            <button className='bg-black text-white px-5 py-3 rounded-2xl font-medium hover:opacity-90 transition-all'>
              + Add Product
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8'>
          {stats.map((item, index) => (
            <div
              key={index}
              className='bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all'
            >
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-gray-500 text-sm'>
                    {item.title}
                  </p>

                  <h2 className='text-3xl font-bold mt-2'>
                    {item.value}
                  </h2>
                </div>

                <div className='w-14 h-14 rounded-2xl bg-[#f4f4f4] flex items-center justify-center text-2xl'>
                  {item.icon}
                </div>
              </div>

              <p className='text-sm text-gray-500 mt-5'>
                {item.change}
              </p>
            </div>
          ))}
        </div>

        {/* Middle Section */}
        <div className='grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8'>

          {/* Sales Overview */}
         {/* Sales Overview */}
<div className='xl:col-span-2 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm'>
  <div className='flex items-center justify-between mb-6'>
    <div>
      <h2 className='text-2xl font-semibold'>
        Sales Overview
      </h2>

      <p className='text-gray-500 text-sm mt-1'>
        Orders received per day
      </p>
    </div>

    <button className='px-4 py-2 rounded-xl bg-[#f4f4f4] text-sm font-medium'>
      This Month
    </button>
  </div>

  <div className='h-[320px] flex items-end gap-3'>
    {ordersCountDaywise.length > 0 ? (
      ordersCountDaywise.map((item: any) => (
        <div
          key={item.date}
          className='flex-1 flex flex-col items-center h-full justify-end'
        >
          <div
            className='w-full bg-black rounded-t-3xl hover:opacity-80 transition-all'
            style={{
              height: `${Math.max(
                (item.orders / maxOrders) * 100,
                5
              )}%`,
            }}
          />

          <span className='text-xs font-medium mt-2'>
            {item.orders}
          </span>

          <span className='text-[10px] text-gray-500 mt-1 text-center'>
            {item.date}
          </span>
        </div>
      ))
    ) : (
      <div className='flex items-center justify-center w-full h-full text-gray-500'>
        No order data available
      </div>
    )}
  </div>
</div>
          {/* Quick Actions */}
          <div className='bg-white border border-gray-200 rounded-3xl p-6 shadow-sm'>
            <h2 className='text-2xl font-semibold mb-6'>
              Quick Actions
            </h2>

            <div className='flex flex-col gap-4'>

              <button className='w-full bg-[#f7f7f7] hover:bg-black hover:text-white transition-all rounded-2xl p-4 text-left'>
                <h3 className='font-semibold'>
                  Add New Product
                </h3>

                <p className='text-sm opacity-70 mt-1'>
                  Create and publish products.
                </p>
              </button>

              <button className='w-full bg-[#f7f7f7] hover:bg-black hover:text-white transition-all rounded-2xl p-4 text-left'>
                <h3 className='font-semibold'>
                  Manage Orders
                </h3>

                <p className='text-sm opacity-70 mt-1'>
                  Track customer orders easily.
                </p>
              </button>

              <button className='w-full bg-[#f7f7f7] hover:bg-black hover:text-white transition-all rounded-2xl p-4 text-left'>
                <h3 className='font-semibold'>
                  View Analytics
                </h3>

                <p className='text-sm opacity-70 mt-1'>
                  Monitor store growth and revenue.
                </p>
              </button>

            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>

          {/* Recent Orders */}
          <div className='bg-white border border-gray-200 rounded-3xl p-6 shadow-sm'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-2xl font-semibold'>
                Recent Orders
              </h2>

              <button className='text-sm text-gray-500 hover:text-black transition-all'>
                View All
              </button>
            </div>

            <div className='flex flex-col gap-4'>
              {ordersLoading ? (
                <div className='border border-gray-100 rounded-2xl p-4 text-sm text-gray-500'>
                  Loading orders...
                </div>
              ) : ordersError ? (
                <div className='border border-red-200 rounded-2xl p-4 text-sm text-red-600'>
                  Failed to load orders.
                </div>
              ) : recentOrders.length === 0 ? (
                <div className='border border-gray-100 rounded-2xl p-4 text-sm text-gray-500'>
                  No orders yet.
                </div>
              ) : (
                recentOrders.map((order: any, index: number) => (
                <div
                  key={index}
                  className='flex items-center justify-between border border-gray-100 rounded-2xl p-4 hover:bg-[#fafafa] transition-all'
                >
                  <div>
                    <h3 className='font-semibold'>
                      #{order.id}
                    </h3>

                    <p className='text-sm text-gray-500 mt-1'>
                      {order.customer || 'Customer'}
                    </p>
                  </div>

                  <div className='text-right'>
                    <h3 className='font-semibold'>
                      {order.amount}
                    </h3>

                    <p className={`text-sm mt-1 ${
                      order.status === 'DELIVERED'
                        ? 'text-green-600'
                        : order.status === 'PENDING'
                        ? 'text-yellow-600'
                        : order.status === 'CANCELLED'
                        ? 'text-red-600'
                        : 'text-blue-600'
                    }`}>
                      {order.status}
                    </p>
                  </div>
                </div>
              ))
              )}
            </div>
          </div>

          {/* Top Products */}
          <div className='bg-white border border-gray-200 rounded-3xl p-6 shadow-sm'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-2xl font-semibold'>
                Top Products
              </h2>

              <button className='text-sm text-gray-500 hover:text-black transition-all'>
                Manage
              </button>
            </div>

            <div className='flex flex-col gap-4'>
              {productsLoading ? (
                <div className='border border-gray-100 rounded-2xl p-4 text-sm text-gray-500'>
                  Loading products...
                </div>
              ) : productsError ? (
                <div className='border border-red-200 rounded-2xl p-4 text-sm text-red-600'>
                  Failed to load products.
                </div>
              ) : (products?.length ?? 0) === 0 ? (
                <div className='border border-gray-100 rounded-2xl p-4 text-sm text-gray-500'>
                  No products found.
                </div>
              ) : (
                products.slice(0, 6).map((product: SellerProduct, index: number) => (
                <div
                  key={index}
                  className='flex items-center justify-between border border-gray-100 rounded-2xl p-4 hover:bg-[#fafafa] transition-all'
                >
                  <div className='flex items-center gap-4'>
                    <div className='w-14 h-14 rounded-2xl bg-[#f4f4f4] flex items-center justify-center text-2xl'>
                      📦
                    </div>

                    <div>
                      <h3 className='font-semibold'>
                        {product.name}
                      </h3>

                      <p className='text-sm text-gray-500 mt-1'>
                        Stock: {product.stock}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className='font-semibold text-lg'>
                      ₹{Number(product.discountedPrice ?? product.price ?? 0).toLocaleString()}
                    </h3>
                  </div>
                </div>
              ))
              )}
            </div>

            {(lowStockProducts?.length ?? 0) > 0 && (
              <p className='text-sm text-yellow-700 mt-5'>
                Low stock: {lowStockProducts.length} item(s)
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
    
  )
}