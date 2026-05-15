import SidebarWrapper from 'apps/seller-ui/src/shared/components/SidebarWrapper'
import React from 'react'

const Layout = ({children} : {children : React.ReactNode}) => {
  return (
    <div className='flex h-full bg-black min-h-screen '>
        {/* sideBar */}
        <aside className='w-[250px] bg-gray-800 text-white p-4 border-slate-700'>
            <div className='sticky top-0  '>
                <SidebarWrapper/>
                
            </div>

        </aside>

    </div>
  )
}

export default Layout