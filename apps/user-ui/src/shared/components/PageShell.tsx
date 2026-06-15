'use client'

import React from 'react'

const PageShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='w-[90%] md:w-[80%] mx-auto pt-12 md:pt-16 pb-14'>
      {children}
    </div>
  )
}

export default PageShell
