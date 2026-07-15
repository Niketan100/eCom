"use client";

import useOrder from 'apps/seller-ui/src/hooks/useOrder';
import useProducts from 'apps/seller-ui/src/hooks/useProducts';
import type { SellerProduct } from 'apps/seller-ui/src/hooks/useProducts';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  ShoppingBag, 
  Users, 
  DollarSign,
  Plus,
  Download,
  Eye,
  MoreVertical,
  AlertCircle
} from 'lucide-react';

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
      change: percentage_revenue_today ? `+${percentage_revenue_today}%` : '0%',
      changeType: Number(percentage_revenue_today)  > 0 ? 'up' : 'down',
      icon: DollarSign,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-500/10 to-emerald-500/10',
    },
    {
      title: 'Orders',
      value: total_orders ? total_orders.toString() : '0',
      change: percentage_order_today ? `+${percentage_order_today}%` : '0%',
      changeType: Number(percentage_order_today) > 0 ? 'up' : 'down',
      icon: ShoppingBag,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/10 to-cyan-500/10',
    },
    {
      title: 'Products',
      value: products ? products.length.toString() : '0',
      change: 'Active',
      changeType: 'neutral',
      icon: Package,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-500/10 to-pink-500/10',
    },
    {
      title: 'Customers',
      value: total_customers ? total_customers.toString() : '0',
      change: `+${percentage_customers_today}%`,
      changeType: Number(percentage_customers_today) > 0 ? 'up' : 'down',
      icon: Users,
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-500/10 to-red-500/10',
    },
  ];

  const recentOrders = (orders ?? []).slice(0, 6);

  const getStatusColor = (status: string) => {
    const colors = {
      'DELIVERED': 'bg-green-500/10 text-green-400 border-green-500/20',
      'PENDING': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      'CANCELLED': 'bg-red-500/10 text-red-400 border-red-500/20',
      'PROCESSING': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      'SHIPPED': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  };

  const StatCard = ({ stat }: { stat: typeof stats[0] }) => (
    <div className="group bg-gray-800/40 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition-all duration-300 hover:shadow-2xl hover:shadow-black/20">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
          <h3 className="text-3xl font-bold text-white mt-2 tracking-tight">
            {stat.value}
          </h3>
          <div className="flex items-center gap-2 mt-3">
            {stat.changeType === 'up' && (
              <span className="flex items-center gap-1 text-green-400 text-xs font-medium bg-green-500/10 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" />
                {stat.change}
              </span>
            )}
            {stat.changeType === 'down' && (
              <span className="flex items-center gap-1 text-red-400 text-xs font-medium bg-red-500/10 px-2 py-1 rounded-full">
                <TrendingDown className="w-3 h-3" />
                {stat.change}
              </span>
            )}
            {stat.changeType === 'neutral' && (
              <span className="text-gray-400 text-xs font-medium bg-gray-700/50 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            )}
            <span className="text-gray-500 text-xs">today</span>
          </div>
        </div>
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.bgGradient} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
          <stat.icon className={`w-6 h-6 bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
              Dashboard
            </h1>
            <p className="text-gray-400 mt-2 flex items-center gap-2">
              <span>Welcome back, manage your store efficiently</span>
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse" />
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-gray-800/50 border border-gray-700 px-5 py-2.5 rounded-xl font-medium text-gray-300 hover:bg-gray-700 hover:text-white hover:border-gray-600 transition-all duration-200">
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/25">
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Sales Overview */}
          <div className="xl:col-span-2 bg-gray-800/40 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-white">Sales Overview</h2>
                <p className="text-gray-400 text-sm mt-1">Orders received per day</p>
              </div>
              <button className="px-4 py-2 rounded-xl bg-gray-700/50 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200">
                This Month
              </button>
            </div>

            <div className="h-[320px] flex items-end gap-2">
              {ordersCountDaywise.length > 0 ? (
                ordersCountDaywise.map((item: any) => (
                  <div
                    key={item.date}
                    className="flex-1 flex flex-col items-center h-full justify-end group"
                  >
                    <div className="relative w-full">
                      <div
                        className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg group-hover:opacity-80 transition-all duration-300"
                        style={{
                          height: `${Math.max((item.orders / maxOrders) * 100, 5)}%`,
                          minHeight: '8px',
                        }}
                      />
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-900 px-2 py-1 rounded text-xs text-white whitespace-nowrap">
                        {item.orders} orders
                      </div>
                    </div>
                    <span className="text-xs font-medium text-gray-300 mt-2">
                      {item.orders}
                    </span>
                    <span className="text-[10px] text-gray-500 mt-1 text-center">
                      {item.date}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full text-gray-500 gap-2">
                  <Package className="w-12 h-12 opacity-20" />
                  <p className="text-sm">No order data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition-all duration-300">
            <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
            <div className="flex flex-col gap-3">
              <button className="group w-full bg-gray-700/30 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all duration-300 rounded-xl p-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 group-hover:bg-white/10 transition-colors flex items-center justify-center">
                    <Plus className="w-5 h-5 text-blue-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-white transition-colors">
                      Add New Product
                    </h3>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                      Create and publish products
                    </p>
                  </div>
                </div>
              </button>

              <button className="group w-full bg-gray-700/30 hover:bg-gradient-to-r hover:from-green-600 hover:to-emerald-600 transition-all duration-300 rounded-xl p-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 group-hover:bg-white/10 transition-colors flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-green-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-white transition-colors">
                      Manage Orders
                    </h3>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                      Track customer orders easily
                    </p>
                  </div>
                </div>
              </button>

              <button className="group w-full bg-gray-700/30 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 transition-all duration-300 rounded-xl p-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 group-hover:bg-white/10 transition-colors flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-purple-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-white transition-colors">
                      View Analytics
                    </h3>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                      Monitor store growth and revenue
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
              <button className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                View All
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {ordersLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                </div>
              ) : ordersError ? (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Failed to load orders
                </div>
              ) : recentOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No orders yet</p>
                </div>
              ) : (
                recentOrders.map((order: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-700/20 hover:bg-gray-700/40 rounded-xl p-4 transition-all duration-200 border border-gray-700/30 hover:border-gray-600"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-white text-sm">
                          #{order.id?.slice(0, 8) || 'N/A'}
                        </h3>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full border ${getStatusColor(order.status)}`}>
                          {order.status || 'PENDING'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        {order.customer || 'Guest Customer'}
                      </p>
                    </div>
                    <div className="text-right">
                      <h3 className="font-semibold text-white">
                        {order.amount || '₹0'}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Top Products</h2>
              <button className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                Manage
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {productsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                </div>
              ) : productsError ? (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Failed to load products
                </div>
              ) : (products?.length ?? 0) === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No products found</p>
                </div>
              ) : (
                products.slice(0, 6).map((product: SellerProduct, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-700/20 hover:bg-gray-700/40 rounded-xl p-4 transition-all duration-200 border border-gray-700/30 hover:border-gray-600"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-gray-700/50 flex items-center justify-center text-2xl shrink-0">
                       
                        (
                          '📦'
                        )
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white text-sm truncate">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-400">
                            Stock: {product.stock || 0}
                          </span>
                          {(product.stock !== undefined && product.stock < 10) && (
                            <span className="text-xs text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded-full">
                              Low Stock
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <h3 className="font-semibold text-white">
                        ₹{Number(product.discountedPrice ?? product.price ?? 0).toLocaleString()}
                      </h3>
                      {product.discountedPrice && product.price && product.discountedPrice < product.price && (
                        <p className="text-xs text-gray-500 line-through">
                          ₹{Number(product.price).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {(lowStockProducts?.length ?? 0) > 0 && (
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-400" />
                <p className="text-sm text-yellow-400">
                  Low stock alert: {lowStockProducts.length} product(s) need attention
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-700/50 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            © 2026 Seller Dashboard. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              System Online
            </span>
            <span className="text-xs text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}