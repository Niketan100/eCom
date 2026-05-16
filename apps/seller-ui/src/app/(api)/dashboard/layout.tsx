'use client'

import SidebarWrapper from 'apps/seller-ui/src/shared/components/SidebarWrapper'
import React from 'react'
import useSeller from './../../../hooks/useSeller';
import { Header } from '../../widget'


const Layout = ({children} : {children : React.ReactNode}) => {
  const {seller , isLoading, error} = useSeller();
  return (
    <div className='flex h-full min-h-screen'>
      

      <aside className='w-[480px] min-w-[380px] max-w-[500px] border-2 border-r-slate-400  text-white p-4'>
        <div className='sticky top-0 '>
            
            <SidebarWrapper />
        </div>
      </aside>
     
     
      <div className='flex flex-col w-full'>

      <Header seller={seller} isLoading={isLoading} error={error} />

      <main className='flex-1 p-4'>
        {children}
      </main>


      </div>


    </div>
  )
}

export default Layout