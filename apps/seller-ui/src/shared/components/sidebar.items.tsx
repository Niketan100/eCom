import Link from 'next/link'
import React from 'react'

interface props {
    title : string,
    icon : React.ReactNode,
    isActive : boolean,
    href : string
}

const SideItems = ({title, icon , isActive, href} :props) => {
  return (
       <Link
         href={href}
         className={
           `group relative flex items-center justify-start gap-3 rounded-2xl px-4 py-3 ` +
           `text-[15px] font-medium tracking-tight transition-all duration-200 ` +
           (isActive
             ? 'bg-gradient-to-r from-white/12 to-white/5 border border-white/15 shadow-[0_10px_35px_rgba(0,0,0,0.40)]'
             : 'border border-transparent hover:bg-white/5 hover:border-white/10')
         }
       >
           <span
             className={
               `flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ` +
               (isActive ? 'bg-white/10 text-white' : 'bg-white/5 text-gray-300 group-hover:bg-white/10')
             }
           >
             {icon}
           </span>

           <span className={isActive ? 'text-white' : 'text-gray-200 group-hover:text-white'}>
             {title}
           </span>

           {isActive && (
             <span className='absolute right-3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#d7ff3f] shadow-[0_0_0_4px_rgba(215,255,63,0.15)]' />
           )}
       </Link>
  )
}

export default SideItems