'use client'
import React from 'react'

import Link from 'next/link'
import axiosInstance from '../../utils/axiosInstance'
import { useStore } from '../../store'
import router from 'next/router'
import { useQueryClient } from '@tanstack/react-query'

import { HeaderBottom } from './HeaderBottom'
import {
    ChevronDown,
    Heart,
    Search,
    ShoppingCart,
    Tag,
    User,
    LogIn,
    UserPlus,
} from 'lucide-react'
import useUser  from './../../hooks/useUSer'
import { useMutation } from '@tanstack/react-query'

export const Header = () => {

    
    const queryClient = useQueryClient();

    const { loggedInUser, isLoading } = useUser()
        const [accountOpen, setAccountOpen] = React.useState(false)
        const [offersOpen, setOffersOpen] = React.useState(false)


        const onOffersClick = (e: React.MouseEvent) => {
            e.stopPropagation()
            setOffersOpen((v) => !v)
            setAccountOpen(false)
        }


       const logoutMutation = useMutation({
    mutationFn: async () => {
        await axiosInstance.post('/auth/logout', {}, {
            withCredentials: true,
        });
    },
   onSuccess: async () => {
            queryClient.setQueryData(['loggedInUser'], null);

            await queryClient.invalidateQueries({
                queryKey: ['loggedInUser'],
            });
            await queryClient.invalidateQueries({
                queryKey: ['orders'],
            });

            router.push('/login');
},
}
);
//     const cartQuery = useQuery({
//     queryKey: ['cart'],
//     queryFn: async () => {
//       const res = await axiosInstance.get('/products/cart')
//       return res.data as { items: CartItem[]; totals?: { quantity: number; subtotal: number } }
//     },
//   })



//   const totals = cartQuery.data?.totals

    const Cart = useStore((state) => state.cart);
    const wishList = useStore((state) => state.wishList);


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
          <input type="text " placeholder='Search products...' className='border-2 h-[55px] font-poppins border-[#F97316] py-2 px-4 w-[90%]  text-gray-6 00 focus:outline-none focus:ring-2 focus:ring-blue-500'  />

          <div className='w-[10%] cursor-pointer flex items-center justify-center h-[55px]  bg-[#F97316] absolute top-0 right-0'> 
              <Search color='white' />
          </div>

        </div>

                <div className='flex items-center gap-8'>
                                                        <div className='flex items-center gap-4'>
                                                            {/* Offers */}
                                                            <div className='relative'>
                                                                <button
                                                                    type='button'
                                                                    onClick={(e) => {
                                                                        onOffersClick(e)
                                                                    }}
                                                                    className='flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors'
                                                                >
                                                                    <Tag className='h-5 w-5 text-gray-600' />
                                                                    <span className='text-sm font-medium'>Offers</span>
                                                                    <ChevronDown className='h-4 w-4 text-gray-500' />
                                                                </button>

                                                                {offersOpen && (
                                                                    <div
                                                                        onClick={(e) => e.stopPropagation()}
                                                                        className='absolute right-0 mt-2 w-[320px] rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden z-50'
                                                                    >
                                                                        <div className='p-4 border-b border-gray-100'>
                                                                            <div className='text-sm font-semibold text-gray-900'>Today’s deals</div>
                                                                            <div className='text-xs text-gray-500 mt-1'>Hand-picked offers for you.</div>
                                                                        </div>
                                                                        <div className='p-4 space-y-3'>
                                                                            <div className='rounded-xl bg-gray-50 border border-gray-100 p-3'>
                                                                                <div className='text-sm font-semibold text-gray-900'>Free delivery</div>
                                                                                <div className='text-xs text-gray-600 mt-1'>On selected products and locations.</div>
                                                                            </div>
                                                                            <div className='rounded-xl bg-gray-50 border border-gray-100 p-3'>
                                                                                <div className='text-sm font-semibold text-gray-900'>Up to 20% off</div>
                                                                                <div className='text-xs text-gray-600 mt-1'>Check product pages for discount tags.</div>
                                                                            </div>
                                                                            <Link
                                                                                href={'/products'}
                                                                                className='inline-flex items-center justify-center w-full rounded-xl bg-black text-white py-2 text-sm font-semibold hover:bg-gray-900'
                                                                            >
                                                                                Browse products
                                                                            </Link>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Account */}
                                                            <div className='relative'>
                                                                <button
                                                                    type='button'
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        setAccountOpen((v) => !v)
                                                                        setOffersOpen(false)
                                                                    }}
                                                                    className='flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors'
                                                                    aria-label='Account'
                                                                >
                                                                    <User className='h-5 w-5 text-gray-600' />
                                                                    <span className='text-sm font-medium'>
                                                                        {isLoading ? 'Loading…' : (loggedInUser as any)?.name || 'Account'}
                                                                    </span>
                                                                    <ChevronDown className='h-4 w-4 text-gray-500' />
                                                                </button>

                                                                {accountOpen &&  (
                                                                    <div
                                                                        onClick={(e) => e.stopPropagation()}
                                                                        className='absolute right-0 mt-2 w-[280px] rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden z-50'
                                                                    >
                                                                        <div className='p-4 border-b border-gray-100'>
                                                                            <div className='text-sm font-semibold text-gray-900'>Account</div>
                                                                            <div className='text-xs text-gray-500 mt-1'>Quick links</div>
                                                                        </div>
                                                                            
                                                                             <div className='p-2'>

                                                                               {loggedInUser&&  <div className='p-2'>

                                                                                
                                                                            <Link
                                                                                href={'/orders'}
                                                                                className='flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-700 hover:bg-gray-50'
                                                                            >
                                                                                <ShoppingCart className='h-4 w-4 text-gray-500' />
                                                                                My orders
                                                                            </Link>
                                                                            <Link
                                                                                href={'/wish-list'}
                                                                                className='flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-700 hover:bg-gray-50'
                                                                            >
                                                                                <Heart className='h-4 w-4 text-gray-500' />
                                                                                Wishlist
                                                                            </Link>
                                                                            <Link
                                                                                href={'/cart'}
                                                                                className='flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-700 hover:bg-gray-50'
                                                                            >
                                                                                <ShoppingCart className='h-4 w-4 text-gray-500' />
                                                                                Cart
                                                                            </Link>
                                                                            <Link
                                                                                href={'/#'}
                                                                                 onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                    logoutMutation.mutate();
    }}
                                                                                className='flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-700 hover:bg-gray-50'
                                                                            >
                                                                                <Heart className='h-4 w-4 text-gray-500' />
                                                                                SignOut
                                                                            </Link>
                                                                            </div>
                                                                        }

                                                                            <div className='h-px bg-gray-100 my-2' />

                                                                            

                                                                            

                                                                            <a
                                                                                href={process.env.NEXT_PUBLIC_SELLER_URL || 'http://localhost:3001/login'}
                                                                                target='_blank'
                                                                                rel='noreferrer'
                                                                                className='flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm text-gray-900 hover:bg-gray-50'
                                                                            >
                                                                                <span className='flex items-center gap-2'>
                                                                                                                            <Tag className='h-4 w-4 text-gray-500' />
                                                                                    Become a Seller
                                                                                </span>
                                                                                <span className='text-xs text-gray-400'>opens</span>
                                                                            </a>
                                                                                
                                                                            {!loggedInUser && !isLoading && (
                                                                                <>
                                                                                    <Link
                                                                                        href={'/login'}
                                                                                        className='flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-700 hover:bg-gray-50'
                                                                                    >
                                                                                        <LogIn className='h-4 w-4 text-gray-500' />
                                                                                        Login
                                                                                    </Link>
                                                                                    <Link
                                                                                        href={'/signup'}
                                                                                        className='flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-700 hover:bg-gray-50'
                                                                                    >
                                                                                        <UserPlus className='h-4 w-4 text-gray-500' />
                                                                                        Create account
                                                                                    </Link>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>

              <Link href={'/wish-list'} className=' relative text-gray-600 hover:text-gray-800 transition-colors duration-300'>
                  <Heart color='red'/> 
                  <div className='w-4 h-4  bg-red-500 rounded-full flex items-center justify-center absolute top-[-5px] right-[-4px] text-white text-xs font-bold'>
                      {wishList.length || 0}
                  </div>
              </Link>

              <Link href={'/cart'} className=' relative text-gray-600 hover:text-gray-800 transition-colors duration-300'>
                  <ShoppingCart color='gray'/>
                  <div className='w-4 h-4  bg-red-500 rounded-full flex items-center justify-center absolute top-[-5px] right-[-4px] text-white text-xs font-bold'>
                      {Cart.length || 0}
                    </div>  
              </Link>
              </div>
          </div>
      </div>
      <div className='border-b border-gray-200 w-full' />
      <HeaderBottom />
      

    </div>
    </>
  )
}
 