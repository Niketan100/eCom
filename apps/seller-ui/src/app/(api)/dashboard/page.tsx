'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '../../../utils/axiosInstance'

import { Header } from '../../widget'


const Page = () => {
    const { data: seller, isLoading, error } = useQuery<any>({
        queryKey: ['dashboardData'],
        queryFn: async () => {
           try {
            const res = await axiosInstance.get('/auth/logged-in-seller')
            return res.data?.seller ?? null
           } catch (err) {
            console.error('Error fetching dashboard data:', err)
            throw new Error('Failed to fetch dashboard data')
           }
        },
        
    })

    console.log('Seller data:', seller)

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Failed to load dashboard.</div>
    }
  return (
    <>
            <Header seller={seller} isLoading={isLoading} error={error} />
    <div className='flex justify-center items-center w-full min-h-[80vh]'>
        <div className='flex flex-col justify-center items-center w-full mt-8'>
            <h1 className='text-gray-400 text-2xl '>
                WELCOME TO YOUR DASHBOARD, {seller?.name || 'SELLER'}!
            </h1>
        </div>
    </div>
    </>

  )
}

export default Page