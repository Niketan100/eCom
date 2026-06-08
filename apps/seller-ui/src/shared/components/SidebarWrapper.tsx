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
  items,
  manageShopItems,
  products,
} from '../../configs/constants'

const SidebarSection = ({ title, children }: any) => {
  return (
    <div className='mb-8'>
      <div className='px-4 mb-3 flex items-center gap-3'>
        <div className='h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent' />
        <h2 className='text-[10px] uppercase tracking-[0.28em] text-gray-400 font-semibold'>
          {title}
        </h2>
        <div className='h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent' />
      </div>

      <div className='flex flex-col gap-2'>
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
      className='relative w-full text-white px-5 py-6 bg-gradient-to-b from-[#050505] via-[#07070a] to-[#0b0f19]'
    >

      {/* subtle edge glow */}
      <div className='pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-[#d7ff3f]/20 to-transparent' />

      {/* Header */}
  <div className='sticky top-0 z-50 bg-gradient-to-b from-[#050505] via-[#07070a] to-transparent pb-6 backdrop-blur supports-[backdrop-filter]:bg-[#050505]/70'>

        <Link
          href='/'
          className='flex items-center gap-4 rounded-[28px] p-5 border border-white/10 shadow-[0_14px_50px_rgba(0,0,0,0.55)] transition-all duration-200 bg-white/[0.04] hover:bg-white/[0.06] hover:border-white/15'
        >
          <div className='w-14 h-14 rounded-[18px] bg-white/90 flex items-center justify-center flex-shrink-0'>
            <Logo width={28} height={28} />
          </div>

          <div className='min-w-0'>
            <h3 className='text-base font-semibold text-white truncate'>
              {seller?.name || 'Eshop Seller'}
            </h3>

            <p className='text-[13px] text-gray-400 truncate mt-1'>
              {seller?.shop?.category || 'Shop Category'}
            </p>
          </div>
        </Link>

        {/* Stats */}
  <div className='grid grid-cols-2 gap-3 mt-4'>

          <div className='bg-white/[0.04] border border-white/10 rounded-[22px] p-4 hover:bg-white/[0.06] transition-all'>
            <p className='text-xs text-gray-500'>
              Revenue
            </p>

            <h3 className='text-xl font-bold text-white mt-1'>
              ₹48k
            </h3>
          </div>

          <div className='bg-white/[0.04] border border-white/10 rounded-[22px] p-4 hover:bg-white/[0.06] transition-all'>
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
      <div className='mt-10 rounded-[26px] p-6 text-white border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.05] to-transparent shadow-[0_20px_60px_rgba(0,0,0,0.45)]'>
        <div className='flex items-start justify-between gap-4'>
          <div>
            <h3 className='font-semibold text-[15px] tracking-tight'>
              Boost your store
            </h3>
            <p className='text-[13px] text-gray-300 mt-2 leading-relaxed'>
              Add more products and improve visibility to increase sales.
            </p>
          </div>
          <div className='h-10 w-10 rounded-2xl bg-[#d7ff3f]/15 border border-[#d7ff3f]/25 flex items-center justify-center text-[#d7ff3f] flex-shrink-0'>
            <span className='text-lg font-semibold'>+</span>
          </div>
        </div>

        <button className='w-full mt-5 bg-white text-black rounded-[16px] py-3.5 font-semibold hover:bg-white/90 transition-all duration-200'>
          Upgrade Plan
        </button>
      </div>

    </Box>
  )
}

export default SidebarWrapper