'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  BarChart3,
  Store,
  PlusCircle,
  ChevronRight,
  LogOut,
  Bell,
  Crown
} from 'lucide-react'

import useSidebar from '../../hooks/useSidebar'
import useSeller from '../../hooks/useSeller'

import Box from './box'
import SideItems from './sidebar.items'
import Logo from '../widget/components/svgs/Logo'

import {
  items,
  manageShopItems,
  products,
} from '../../configs/constants'

import useOrder from '../../hooks/useOrder'

const SidebarSection = ({ title, icon: Icon, children }: any) => {
  return (
    <div className='mb-6'>
      <div className='px-4 mb-3 flex items-center gap-3'>
        {Icon && <Icon className='w-3.5 h-3.5 text-gray-500' />}
        <h2 className='text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold'>
          {title}
        </h2>
        <div className='h-px flex-1 bg-gradient-to-r from-gray-700/50 to-transparent' />
      </div>
      <div className='flex flex-col gap-1'>
        {children}
      </div>
    </div>
  )
}

const SidebarWrapper = () => {
  const { activeSidebar, setActiveSidebar } = useSidebar()
  const pathname = usePathname()
  const { seller } = useSeller()

  React.useEffect(() => {
    setActiveSidebar(pathname)
  }, [pathname, setActiveSidebar])

  const { orders, revenue } = useOrder();

  return (
    <Box
      css={{
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 202,
        overflowY: 'auto',
        scrollbarWidth: 'none',
      }}
      className='relative w-full text-white px-4 py-5 bg-gradient-to-b from-[#0a0a0f] via-[#0d0d14] to-[#0f0f1a]'
    >
      {/* Subtle background glow */}
      <div className='pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5' />
      
      {/* Right border glow */}
      <div className='pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-blue-500/20 to-transparent' />
      
      {/* Top gradient overlay */}
      <div className='pointer-events-none absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-500/5 to-transparent' />

      {/* Header */}
      <div className='sticky top-0 z-50 bg-gradient-to-b from-[#0a0a0f] via-[#0d0d14] to-transparent pb-5 backdrop-blur-xl supports-[backdrop-filter]:bg-[#0a0a0f]/80'>
        {/* Logo & Brand */}
        <Link
          href='/'
          className='flex items-center gap-4 rounded-2xl p-4 border border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/10 group'
        >
          <div className='relative w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20'>
            <Logo width={24} height={24} />
            <div className='absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0a0a0f]' />
          </div>

          <div className='min-w-0 flex-1'>
            <h3 className='text-sm font-semibold text-white truncate flex items-center gap-2'>
              {seller?.name || 'Eshop Seller'}
              <span className='px-1.5 py-0.5 text-[8px] font-medium bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 rounded-full border border-blue-500/10'>
                PRO
              </span>
            </h3>
            <p className='text-[11px] text-gray-500 truncate flex items-center gap-1.5 mt-0.5'>
              <Store className='w-3 h-3' />
              {seller?.shop?.category || 'Shop Category'}
            </p>
          </div>
          
          <ChevronRight className='w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors' />
        </Link>

        {/* Stats Cards */}
        <div className='grid grid-cols-2 gap-2.5 mt-4'>
          <div className='group bg-gradient-to-br from-blue-500/10 to-purple-500/5 border border-blue-500/10 rounded-xl p-3.5 hover:border-blue-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5'>
            <div className='flex items-center justify-between'>
              <p className='text-[10px] font-medium text-gray-500 uppercase tracking-wider'>
                Revenue
              </p>
              <div className='w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors'>
                <BarChart3 className='w-3 h-3 text-blue-400' />
              </div>
            </div>
            <h3 className='text-lg font-bold text-white mt-1.5'>
              ₹ {revenue?.toLocaleString() || '0'}
            </h3>
            <div className='flex items-center gap-1.5 mt-1'>
              <span className='text-[8px] text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded-full'>
                +12.5%
              </span>
              <span className='text-[8px] text-gray-500'>this month</span>
            </div>
          </div>

          <div className='group bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/10 rounded-xl p-3.5 hover:border-purple-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5'>
            <div className='flex items-center justify-between'>
              <p className='text-[10px] font-medium text-gray-500 uppercase tracking-wider'>
                Orders
              </p>
              <div className='w-6 h-6 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors'>
                <ShoppingBag className='w-3 h-3 text-purple-400' />
              </div>
            </div>
            <h3 className='text-lg font-bold text-white mt-1.5'>
              {orders?.length || 0}
            </h3>
            <div className='flex items-center gap-1.5 mt-1'>
              <span className='text-[8px] text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded-full'>
                +8.2%
              </span>
              <span className='text-[8px] text-gray-500'>this week</span>
            </div>
          </div>
        </div>

        {/* Notification Bell */}
        <div className='flex justify-end mt-3'>
          <button className='relative w-8 h-8 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all duration-200 flex items-center justify-center'>
            <Bell className='w-4 h-4 text-gray-400' />
            <span className='absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse' />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className='mt-5'>
        <SidebarSection title='Main Menu' icon={LayoutDashboard}>
          {items.map((item) => (
            <SideItems
              key={item.title}
              title={item.title}
              icon={item.icon}
              isActive={item.href === activeSidebar}
              href={item.href}
            />
          ))}
        </SidebarSection>

        <SidebarSection title='Store Management' icon={Store}>
          {manageShopItems.map((item) => (
            <SideItems
              key={item.title}
              title={item.title}
              icon={item.icon}
              isActive={item.href === activeSidebar}
              href={item.href}
            />
          ))}
        </SidebarSection>

        <SidebarSection title='Inventory' icon={Package}>
          {products.map((item) => (
            <SideItems
              key={item.title}
              title={item.title}
              icon={item.icon}
              isActive={item.href === activeSidebar}
              href={item.href}
            />
          ))}
        </SidebarSection>

        {/* Quick Actions */}
        <div className='mt-6 p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/5 border border-blue-500/10'>
          <div className='flex items-center gap-2.5'>
            <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0'>
              <PlusCircle className='w-4 h-4 text-white' />
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-xs font-medium text-white'>Quick Add</p>
              <p className='text-[10px] text-gray-500'>New product or offer</p>
            </div>
            <button className='text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium'>
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className='absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a0a0f] to-transparent'>
        <div className='flex flex-col gap-2'>
          {/* Upgrade Card */}
          <button className='w-full p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/10 hover:border-amber-500/20 transition-all duration-300 group'>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0'>
                <Crown className='w-4 h-4 text-white' />
              </div>
              <div className='flex-1 text-left'>
                <p className='text-xs font-medium text-white group-hover:text-amber-400 transition-colors'>
                  Upgrade to Pro
                </p>
                <p className='text-[9px] text-gray-500'>Get premium features</p>
              </div>
              <ChevronRight className='w-3.5 h-3.5 text-gray-600 group-hover:text-amber-400 transition-colors' />
            </div>
          </button>

          {/* Logout */}
          <button className='w-full p-2.5 rounded-xl hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-300 group'>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-red-500/20 transition-colors'>
                <LogOut className='w-3.5 h-3.5 text-red-400 group-hover:text-red-300 transition-colors' />
              </div>
              <div className='flex-1 text-left'>
                <p className='text-xs font-medium text-gray-400 group-hover:text-red-400 transition-colors'>
                  Logout
                </p>
                <p className='text-[9px] text-gray-600'>Sign out of your account</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </Box>
  )
}

export default SidebarWrapper