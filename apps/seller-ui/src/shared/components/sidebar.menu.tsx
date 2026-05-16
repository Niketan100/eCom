import React from 'react'

interface props {
    title : string,
    children : React.ReactNode
}

const SideMenu = ({title , children} : props ) => {
  return (
    <div className='block'>
        <div className='text-xs tracking-[0.04rem] pl-1 '>
            {title}
        </div>
        {children}

    </div>
  )
}

export default SideMenu