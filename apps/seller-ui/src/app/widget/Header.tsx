'use client'

import Link from 'next/link'
import React from 'react'
import { HeaderBottom } from './HeaderBottom'
import { ShoppingCart, Heart, Search , User } from 'lucide-react'


export const Header = ({seller  ,isLoading  ,error } : {seller : any ,isLoading : boolean ,error : any}) => {
   
    const loggedInUser = seller;

  return (
    <>
    <div className='w-full bg-white'>

      <div className='w-[80%] py-5 m-auto flex justify-between items-center '>
        <div>
            <Link href={'/'} className='text-3xl font-bold text-gray-800 no-underline'>
                Eshop
            </Link> 
        </div>
        <div className='w-[50%] relative'>
          <input type="text " placeholder='Search products...' className='border-2 h-[55px] font-poppins  py-2 px-4 w-[90%]  text-gray-6 00 focus:outline-none focus:ring-2 focus:ring-blue-500'  />

          <div className='w-[10%] cursor-pointer flex items-center justify-center h-[55px]  bg-black absolute top-0 right-0'> 
              <Search color='white' />
          </div>

        </div>

                <div className='flex items-center gap-8'>
                            <div className='flex items-center gap-2'>
                                {isLoading ? (
                                    <div className='text-gray-500 text-sm'>Loading...</div>
                                ) : loggedInUser ? (
                                    <div className='flex items-center gap-2 text-gray-700'>
                                        <User color='gray' />
                                        <span className='font-medium'>
                                            {(loggedInUser as any)?.name || 'Account'}
                                        </span>
                                    </div>
                                ) : (
                                    <>
                                        <Link href={'/login'} className='text-gray-600 hover:text-gray-800 transition-colors duration-300'>
                                                <User color='gray' />
                                        </Link>
                                        <Link href={'/register'} className='text-gray-600 hover:text-gray-800 transition-colors duration-300'>
                                                Register
                                        </Link>
                                    </>
                                )}

            
              </div>
          </div>
      </div>
      <div className='border-b border-gray-200 w-full' />

      

    </div>
    </>
  )
}
 