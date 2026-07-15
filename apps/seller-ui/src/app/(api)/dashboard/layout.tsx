'use client'

import SidebarWrapper from 'apps/seller-ui/src/shared/components/SidebarWrapper'
import React from 'react'
import useSeller from '../../../hooks/useSeller';
import { Header } from '../../widget'
import { useRouter } from 'next/navigation'


const Layout = ({children} : {children : React.ReactNode}) => {
  const {seller , isLoading, error} = useSeller();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !seller) {
      router.replace('/login');
    }
  }, [isLoading, seller, router]);

  if (!isLoading && !seller) {
    return null;
  }
  return (
    <div className='flex h-full min-h-screen bg-slate-900'>
      

      <aside className='w-[420px] min-w-[380px] max-w-[480px] border-r border-white/10 text-white p-5 bg-[#050505]'>
        <div className='sticky top-0'>
            
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