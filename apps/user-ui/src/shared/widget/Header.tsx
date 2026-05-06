import Link from 'next/dist/client/link'
import React from 'react'
import { HeaderBottom } from './HeaderBottom'
import { ShoppingCart, Heart, Search , User } from 'lucide-react'


export const Header = () => {
  return (
    <div className='w-full bg-white'>

      <div className='w-[80%] py-5 m-auto flex justify-between items-center '>
        <div>
            <Link href={'/'} className='text-3xl font-bold text-gray-800 no-underline'>
                Eshop
            </Link> 
        </div>
        <div className='w-[50%] relative'>
          <input type="text " placeholder='Search products...' className='border-2 h-[55px] font-poppins border-blue-500 py-2 px-4 w-[90%]  text-gray-6 00 focus:outline-none focus:ring-2 focus:ring-blue-500'  />

          <div className='w-[10%] cursor-pointer flex items-center justify-center h-[55px]  bg-blue-500 absolute top-0 right-0'> 
              <Search color='white' />
          </div>

        </div>

        <div className='flex items-center gap-8'>
              <div className='flex items-center gap-2'>
                  <Link href={'/login'} className='text-gray-600 hover:text-gray-800 transition-colors duration-300'>
                      <User color='gray' />
              </Link>
              <Link href={'/register'} className='text-gray-600 hover:text-gray-800 transition-colors duration-300'>
                  Register
              </Link>

              <Link href={'/wish-list'} className=' relative text-gray-600 hover:text-gray-800 transition-colors duration-300'>
                  <Heart color='red'/> 
                  <div className='w-4 h-4  bg-red-500 rounded-full flex items-center justify-center absolute top-[-5px] right-[-4px] text-white text-xs font-bold'>
                      3
                  </div>
              </Link>

              <Link href={'/cart'} className=' relative text-gray-600 hover:text-gray-800 transition-colors duration-300'>
                  <ShoppingCart color='gray'/>
                  <div className='w-4 h-4  bg-red-500 rounded-full flex items-center justify-center absolute top-[-5px] right-[-4px] text-white text-xs font-bold'>
                      2
                  </div>  
              </Link>
              </div>
          </div>
      </div>
      <div className='border-b border-gray-200 w-full' />
      <HeaderBottom />
      

    </div>
  )
}
 