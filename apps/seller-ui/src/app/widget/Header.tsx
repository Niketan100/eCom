'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import { Search, User, Bell, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react'
import { useUnreadNotificationCount } from 'apps/seller-ui/src/hooks/useNotifications'

export const Header = ({ seller, isLoading, error }: { seller: any, isLoading: boolean, error: any }) => {
    const loggedInUser = seller;
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const { data: unreadData } = useUnreadNotificationCount()
    const unreadCount = unreadData?.unreadCount ?? 0

    return (
        <>
            <header className="sticky top-0 z-50 bg-gradient-to-br from-[#0a0a0f] via-[#0d0d14] to-[#0f0f1a] border-b border-white/5 shadow-2xl shadow-black/50">
                {/* Subtle background glow */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <div className="flex items-center gap-8">
                            <Link 
                                href={'/'} 
                                className="group flex items-center gap-3 no-underline"
                            >
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-all duration-300 group-hover:scale-105">
                                    <ShoppingBag className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                    Eshop
                                </span>
                            </Link>

                            {/* Desktop Navigation */}
                            <nav className="hidden md:flex items-center gap-1">
                                <Link href="/dashboard" className="px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200">
                                    Home
                                </Link>
                                <Link href="/dashboard/manage-products" className="px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200">
                                    Products
                                </Link>
                               
                            </nav>
                        </div>

                        {/* Search Bar - Desktop */}
                        <div className="hidden md:flex flex-1 max-w-xl mx-8">
                            <div className="relative w-full group">
                                <input 
                                    type="text" 
                                    placeholder="Search products..." 
                                    className="w-full h-11 pl-4 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 hover:bg-white/10"
                                />
                                <button className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-blue-500/25">
                                    <Search className="w-4 h-4 text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-3 md:gap-4">
                            {/* Search Toggle - Mobile */}
                            <button 
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className="md:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
                            >
                                <Search className="w-4 h-4" />
                            </button>

                            {/* Notifications */}
                            <Link
                                href={'/dashboard/notifications'}
                                className="relative w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200 group"
                            >
                                <Bell className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold leading-[18px] text-center shadow-lg shadow-red-500/25 animate-pulse">
                                        {unreadCount > 99 ? '99+' : unreadCount}
                                    </span>
                                )}
                            </Link>

                            {/* User Menu */}
                            <div className="relative">
                                {isLoading ? (
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                                    </div>
                                ) : loggedInUser ? (
                                    <div className="flex items-center gap-3 group cursor-pointer">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-all duration-200">
                                                <User className="w-4 h-4 text-blue-400" />
                                            </div>
                                            <div className="hidden sm:block text-left">
                                                <p className="text-sm font-medium text-white leading-none">
                                                    {loggedInUser?.name || 'Account'}
                                                </p>
                                                <p className="text-[10px] text-gray-500 mt-0.5">
                                                    {loggedInUser?.role || 'Customer'}
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronDown className="hidden sm:block w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-colors duration-200" />
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Link 
                                            href={'/login'} 
                                            className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                                        >
                                            Sign In
                                        </Link>
                                        <Link 
                                            href={'/register'} 
                                            className="px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/25"
                                        >
                                            Register
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Mobile Menu Toggle */}
                            <button 
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
                            >
                                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Search */}
                    {isSearchOpen && (
                        <div className="md:hidden pb-4 animate-slideDown">
                            <div className="relative w-full">
                                <input 
                                    type="text" 
                                    placeholder="Search products..." 
                                    className="w-full h-11 pl-4 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                                    autoFocus
                                />
                                <button className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                                    <Search className="w-4 h-4 text-white" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-white/5 bg-[#0a0a0f]/95 backdrop-blur-xl animate-slideDown">
                        <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
                            <Link href="/" className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200">
                                Home
                            </Link>
                            <Link href="/products" className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200">
                                Products
                            </Link>
                            <Link href="/categories" className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200">
                                Categories
                            </Link>
                            {!loggedInUser && !isLoading && (
                                <div className="pt-4 mt-2 border-t border-white/5 space-y-2">
                                    <Link href="/login" className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200">
                                        Sign In
                                    </Link>
                                    <Link href="/register" className="block px-4 py-3 text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-center">
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* Add animation styles */}
            <style jsx>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slideDown {
                    animation: slideDown 0.3s ease-out;
                }
            `}</style>
        </>
    )
}