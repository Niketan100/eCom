
'use client'
import { AlignLeft, ChevronDown } from 'lucide-react';
import {  useEffect, useState } from 'react';
import { navItems } from '../../configs/constants';
import Link from 'next/link';
export const HeaderBottom = () => {
    const [show, setShow] = useState(false);
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsSticky(scrollTop > 100); // Adjust the threshold as needed
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };  
    }, []);
  return (
    <div className={`w-full bg-white py-3 transition-all duration-300 ${isSticky ? 'fixed top-0 left-0 shadow-lg z-50' : 'relative'}`}>
        
        <div className={`w-[80%] m-auto  flex gap-8 items-center justify-start relative ${isSticky ? 'pt-3' : 'py-0' }`}>
            <div className={`w-[260px] bg-black text-white ${isSticky ? '-mb-2' : 'cursor-pointer flex items-center justify-between px-5 h-[50px] ' } `} 
                onClick={() => setShow(!show)}
            >
                <div className='flex items-center gap-2'>
                        <AlignLeft color='black' />
                        <span className=' font-medium '>
                            All Departments
                        </span>
                </div>
                <ChevronDown color='white' />
            </div>
            {show && (
                <div className={`w-[260px] absolute  left-0 ${isSticky ? 'top-[70px]' : 'top-[50px]'} bg-white text-black shadow-lg rounded-md mt-2 p-4 z-10`}>
                    <ul className='space-y-2'>
                        <li className='hover:bg-gray-100 rounded-md px-3 py-2 cursor-pointer'>Electronics</li>
                        <li className='hover:bg-gray-100 rounded-md px-3 py-2 cursor-pointer'>Fashion</li>
                        <li className='hover:bg-gray-100 rounded-md px-3 py-2 cursor-pointer'>Home & Garden</li>
                        <li className='hover:bg-gray-100 rounded-md px-3 py-2 cursor-pointer'>Sports</li>
                        <li className='hover:bg-gray-100 rounded-md px-3 py-2 cursor-pointer'>Toys</li>
                    </ul>
                </div>
            )}
            {/* Navigaton LInks */}
            {
                 <div className='flex items-center'>
                    {navItems.map((i:NavItemType , index : number) => (
                        <Link href={i.href} className='px-5 font-medium text-lg text-black  ' key={index}>
                             {i.title}
                        </Link>
                    ))}
                 </div>
            }
        </div>
    </div>
  )
}
