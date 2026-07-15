'use client'
import { AlignLeft, ChevronDown, X, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { navItems } from '../../configs/constants';
import Link from 'next/link';

interface NavItemType {
    title: string;
    href: string;
}

export const HeaderBottom = () => {
    const [show, setShow] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsSticky(scrollTop > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const categories = [
        { name: 'Electronics', icon: '💻', count: '245' },
        { name: 'Fashion', icon: '👗', count: '189' },
        { name: 'Home & Garden', icon: '🏠', count: '156' },
        { name: 'Sports', icon: '⚽', count: '98' },
        { name: 'Toys', icon: '🧸', count: '67' },
        { name: 'Books', icon: '📚', count: '234' },
        { name: 'Beauty', icon: '💄', count: '143' },
        { name: 'Automotive', icon: '🚗', count: '76' },
    ];

    return (
        <>
            <div className={`
                w-full bg-gradient-to-br from-[#0a0a0f] via-[#0d0d14] to-[#0f0f1a] 
                border-b border-white/5 transition-all duration-500
                ${isSticky ? 'fixed top-0 left-0 shadow-2xl shadow-black/50 z-40' : 'relative'}
            `}>
                {/* Subtle background glow */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
                
                <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${isSticky ? 'py-2' : 'py-3'}`}>
                    <div className="flex items-center gap-4 md:gap-8 relative">
                        
                        {/* Categories Dropdown */}
                        <div className="relative">
                            <button 
                                className={`
                                    group flex items-center gap-3 px-4 md:px-6 py-2.5 
                                    bg-gradient-to-r from-blue-500/10 to-purple-500/10 
                                    border border-blue-500/20 hover:border-blue-500/40 
                                    rounded-xl transition-all duration-300
                                    hover:shadow-lg hover:shadow-blue-500/10
                                    ${isSticky ? 'py-2' : ''}
                                `}
                                onClick={() => setShow(!show)}
                                onMouseEnter={() => setShow(true)}
                                onMouseLeave={() => setShow(false)}
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                        <AlignLeft className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <span className="text-sm font-medium text-white hidden sm:inline">
                                        Categories
                                    </span>
                                </div>
                                <ChevronDown className={`
                                    w-4 h-4 text-gray-400 transition-transform duration-300
                                    ${show ? 'rotate-180' : ''}
                                    group-hover:text-gray-300
                                `} />
                            </button>

                            {/* Dropdown Menu */}
                            {show && (
                                <div 
                                    className={`
                                        absolute left-0 w-72 md:w-80 
                                        ${isSticky ? 'top-[52px]' : 'top-[52px]'} 
                                        bg-[#0d0d14] border border-white/10 rounded-2xl 
                                        shadow-2xl shadow-black/50 p-2 z-50
                                        backdrop-blur-xl bg-[#0d0d14]/95
                                        animate-slideDown
                                    `}
                                    onMouseEnter={() => setShow(true)}
                                    onMouseLeave={() => setShow(false)}
                                >
                                    <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
                                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            All Categories
                                        </span>
                                        <button 
                                            onClick={() => setShow(false)}
                                            className="p-1 rounded-lg hover:bg-white/5 transition-colors"
                                        >
                                            <X className="w-3.5 h-3.5 text-gray-500" />
                                        </button>
                                    </div>
                                    
                                    <div className="max-h-[400px] overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                        {categories.map((category, index) => (
                                            <div
                                                key={index}
                                                className={`
                                                    flex items-center justify-between px-3 py-2.5 
                                                    rounded-xl cursor-pointer transition-all duration-200
                                                    ${activeCategory === category.name 
                                                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/20' 
                                                        : 'hover:bg-white/5'
                                                    }
                                                `}
                                                onMouseEnter={() => setActiveCategory(category.name)}
                                                onMouseLeave={() => setActiveCategory(null)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xl">{category.icon}</span>
                                                    <div>
                                                        <p className="text-sm font-medium text-white">
                                                            {category.name}
                                                        </p>
                                                        <p className="text-[10px] text-gray-500">
                                                            {category.count} products
                                                        </p>
                                                    </div>
                                                </div>
                                                <ChevronRight className={`
                                                    w-4 h-4 transition-all duration-200
                                                    ${activeCategory === category.name 
                                                        ? 'text-blue-400 opacity-100' 
                                                        : 'text-gray-600 opacity-0 group-hover:opacity-100'
                                                    }
                                                `} />
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="px-3 py-2.5 border-t border-white/5 mt-1">
                                        <Link 
                                            href="/categories"
                                            className="flex items-center justify-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                        >
                                            View All Categories
                                            <ChevronRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Navigation Links */}
                        <nav className="hidden lg:flex items-center gap-1 flex-1 overflow-x-auto scrollbar-hide">
                            {navItems.map((item: NavItemType, index: number) => (
                                <Link 
                                    href={item.href} 
                                    className={`
                                        relative px-4 py-2 text-sm font-medium text-gray-300 
                                        hover:text-white transition-all duration-200
                                        group whitespace-nowrap
                                    `} 
                                    key={index}
                                >
                                    {item.title}
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full" />
                                </Link>
                            ))}
                        </nav>

                        {/* Mobile Navigation - Scrollable */}
                        <div className="flex lg:hidden items-center gap-1 flex-1 overflow-x-auto scrollbar-hide py-1">
                            {navItems.slice(0, 4).map((item: NavItemType, index: number) => (
                                <Link 
                                    href={item.href} 
                                    className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 whitespace-nowrap" 
                                    key={index}
                                >
                                    {item.title}
                                </Link>
                            ))}
                            {navItems.length > 4 && (
                                <button className="px-3 py-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors whitespace-nowrap">
                                    +{navItems.length - 4} more
                                </button>
                            )}
                        </div>

                        {/* Quick Action - Hot Deals */}
                        <div className="hidden md:flex items-center gap-2 ml-auto">
                            <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20">
                                <span className="text-xs font-medium text-red-400 animate-pulse">
                                    🔥 Hot Deals
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Spacer for sticky header */}
            {isSticky && <div className="h-[52px] md:h-[60px]" />}

            {/* Add animation styles */}
            <style jsx>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-8px) scale(0.98);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                .animate-slideDown {
                    animation: slideDown 0.25s ease-out;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-thin::-webkit-scrollbar {
                    width: 4px;
                }
                .scrollbar-thin::-webkit-scrollbar-track {
                    background: transparent;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.1);
                    border-radius: 10px;
                }
            `}</style>
        </>
    )
}