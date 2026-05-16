export default function SellerDashboard() {
  const stats = [
    {
      title: 'Total Revenue',
      value: '₹48,320',
      change: '+12% this month',
      icon: '💰',
    },
    {
      title: 'Orders',
      value: '324',
      change: '+18 new today',
      icon: '📦',
    },
    {
      title: 'Products',
      value: '48',
      change: '6 low stock',
      icon: '🛍️',
    },
    {
      title: 'Customers',
      value: '1,204',
      change: '+32 this week',
      icon: '👥',
    },
  ];

  const orders = [
    {
      id: '#ORD-1024',
      customer: 'Rahul Sharma',
      amount: '₹2,400',
      status: 'Delivered',
    },
    {
      id: '#ORD-1025',
      customer: 'Aman Verma',
      amount: '₹1,250',
      status: 'Pending',
    },
    {
      id: '#ORD-1026',
      customer: 'Priya Thakur',
      amount: '₹4,100',
      status: 'Shipped',
    },
    {
      id: '#ORD-1027',
      customer: 'Neha Kapoor',
      amount: '₹899',
      status: 'Cancelled',
    },
  ];

  const products = [
    {
      name: 'Wireless Headphones',
      stock: 24,
      price: '₹2,999',
    },
    {
      name: 'Smart Watch',
      stock: 12,
      price: '₹4,499',
    },
    {
      name: 'Gaming Mouse',
      stock: 8,
      price: '₹1,299',
    },
  ];

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
          <div className='xl:col-span-2 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm'>
            <div className='flex items-center justify-between mb-6'>
              <div>
                <h2 className='text-2xl font-semibold'>
                  Sales Overview
                </h2>

                <p className='text-gray-500 text-sm mt-1'>
                  Monthly performance overview
                </p>
              </div>

              <button className='px-4 py-2 rounded-xl bg-[#f4f4f4] text-sm font-medium'>
                This Month
              </button>
            </div>

            {/* Fake Chart */}
            <div className='h-[320px] w-full flex items-end justify-between gap-4'>
              {[40, 65, 30, 90, 55, 70, 85, 60].map((height, index) => (
                <div
                  key={index}
                  className='flex-1 bg-black rounded-t-3xl opacity-90 hover:opacity-100 transition-all'
                  style={{ height: `${height}%` }}
                ></div>
              ))}
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
              {orders.map((order, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between border border-gray-100 rounded-2xl p-4 hover:bg-[#fafafa] transition-all'
                >
                  <div>
                    <h3 className='font-semibold'>
                      {order.id}
                    </h3>

                    <p className='text-sm text-gray-500 mt-1'>
                      {order.customer}
                    </p>
                  </div>

                  <div className='text-right'>
                    <h3 className='font-semibold'>
                      {order.amount}
                    </h3>

                    <p className={`text-sm mt-1 ${
                      order.status === 'Delivered'
                        ? 'text-green-600'
                        : order.status === 'Pending'
                        ? 'text-yellow-600'
                        : order.status === 'Cancelled'
                        ? 'text-red-600'
                        : 'text-blue-600'
                    }`}>
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
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
              {products.map((product, index) => (
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
                      {product.price}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
