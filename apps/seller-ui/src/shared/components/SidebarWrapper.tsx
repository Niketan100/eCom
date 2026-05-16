'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

import useSidebar from '../../hooks/useSidebar'
import useSeller from '../../hooks/useSeller'

import Box from './box'
import SideItems from './sidebar.items'
import Logo from '../widget/components/svgs/Logo'

import {
  controllers,
  events,
  items,
  manageShopItems,
  products,
} from '../../configs/constants'

const SidebarSection = ({ title, children }: any) => {
  return (
    <div className='mb-7'>
      <div className='px-4 mb-3'>
        <h2 className='text-[11px] uppercase tracking-[0.22em] text-gray-500 font-semibold'>
          {title}
        </h2>
      </div>

      <div className='flex flex-col gap-1.5'>
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
      className='w-full bg-[#050505] border-r border-white/10 px-4 py-5 text-white'
    >

      {/* Header */}
      <div className='sticky top-0 z-50 bg-[#050505] pb-5'>

        <Link
          href='/'
          className='flex items-center gap-4 bg-[#0d0d0d] hover:bg-[#121212] transition-all duration-200 rounded-[30px] p-4 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)]'
        >
          <div className='w-14 h-14 rounded-[20px] bg-white flex items-center justify-center flex-shrink-0'>
            <Logo width={28} height={28} />
          </div>

          <div className='min-w-0'>
            <h3 className='text-base font-semibold text-white truncate'>
              {seller?.name || 'Eshop Seller'}
            </h3>

            <p className='text-sm text-gray-400 truncate mt-1'>
              {seller?.shop?.category || 'Shop Category'}
            </p>
          </div>
        </Link>

        {/* Stats */}
        <div className='grid grid-cols-2 gap-3 mt-4'>

          <div className='bg-[#0d0d0d] border border-white/10 rounded-[24px] p-4 hover:bg-[#141414] transition-all'>
            <p className='text-xs text-gray-500'>
              Revenue
            </p>

            <h3 className='text-xl font-bold text-white mt-1'>
              ₹48k
            </h3>
          </div>

          <div className='bg-[#0d0d0d] border border-white/10 rounded-[24px] p-4 hover:bg-[#141414] transition-all'>
            <p className='text-xs text-gray-500'>
              Orders
            </p>

            <h3 className='text-xl font-bold text-white mt-1'>
              324
            </h3>
          </div>

        </div>
      </div>

      {/* Navigation */}
      <div className='mt-7'>

        <SidebarSection title='Dashboard'>
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

        <SidebarSection title='Manage Shop'>
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

        <SidebarSection title='Products'>
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

        <SidebarSection title='Events'>
          {events.map((item) => (
            <SideItems
              key={item.title}
              title={item.title}
              icon={item.icon}
              isActive={item.href === activeSidebar}
              href={item.href}
            />
          ))}
        </SidebarSection>

        <SidebarSection title='Controls'>
          {controllers.map((item) => (
            <SideItems
              key={item.title}
              title={item.title}
              icon={item.icon}
              isActive={item.href === activeSidebar}
              href={item.href}
            />
          ))}
        </SidebarSection>

      </div>

      {/* Bottom Card */}
      <div className='mt-10 bg-white rounded-[30px] p-6 text-black'>
        <h3 className='font-bold text-lg'>
          Boost Your Store 🚀
        </h3>

        <p className='text-sm text-gray-600 mt-2 leading-relaxed'>
          Add more products and improve your store visibility to increase sales.
        </p>

        <button className='w-full mt-5 bg-black text-white rounded-[18px] py-3.5 font-semibold hover:bg-[#111] transition-all duration-200'>
          Upgrade Plan
        </button>
      </div>

    </Box>
  )
}

export default SidebarWrapper