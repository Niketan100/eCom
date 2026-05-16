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
       <Link href={href} className={`flex items-center  justify-center h-14 gap-3 text-xl font-medium  rounded-md px-3 py-2 ${isActive ? 'bg-slate-600' : 'hover:bg-slate-700/50'}`}>
           {icon }
           <span>{title}</span>
       </Link>
  )
}

export default SideItems