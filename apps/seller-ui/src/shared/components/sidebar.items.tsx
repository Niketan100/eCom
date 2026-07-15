import Link from 'next/link'
import React from 'react'
import { ChevronRight } from 'lucide-react'

interface Props {
    title: string,
    icon: React.ReactNode,
    isActive: boolean,
    href: string,
    badge?: string | number,
    badgeColor?: string
}

const SideItems = ({ title, icon, isActive, href, badge, badgeColor = 'blue' }: Props) => {
    const getBadgeColor = () => {
        const colors: Record<string, string> = {
            blue: 'bg-blue-500/20 text-blue-400 border-blue-500/20',
            green: 'bg-green-500/20 text-green-400 border-green-500/20',
            red: 'bg-red-500/20 text-red-400 border-red-500/20',
            yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20',
            purple: 'bg-purple-500/20 text-purple-400 border-purple-500/20',
        }
        return colors[badgeColor] || colors.blue
    }

    return (
        <Link
            href={href}
            className={`
                group relative flex items-center justify-start gap-3 rounded-xl px-3.5 py-2.5
                text-[14px] font-medium transition-all duration-300
                ${isActive
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/10 border border-blue-500/20 shadow-lg shadow-blue-500/10'
                    : 'border border-transparent hover:bg-white/[0.04] hover:border-white/5'
                }
                hover:translate-x-0.5
            `}
        >
            {/* Active indicator bar */}
            {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full shadow-lg shadow-blue-500/50" />
            )}

            {/* Icon container */}
            <span
                className={`
                    relative flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300
                    ${isActive 
                        ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-white shadow-lg shadow-blue-500/10' 
                        : 'bg-white/[0.03] text-gray-400 group-hover:bg-white/[0.06] group-hover:text-white'
                    }
                    group-hover:scale-105
                `}
            >
                {icon}
                
                {/* Icon glow */}
                {isActive && (
                    <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-xl" />
                )}
            </span>

            {/* Title */}
            <span 
                className={`
                    flex-1 transition-colors duration-200
                    ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'}
                `}
            >
                {title}
            </span>

            {/* Badge */}
            {badge && (
                <span className={`
                    px-2 py-0.5 text-[10px] font-semibold rounded-full border
                    ${getBadgeColor()}
                `}>
                    {badge}
                </span>
            )}

            {/* Active indicator dot */}
            {isActive ? (
                <span className="relative flex items-center justify-center">
                    <span className="flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-blue-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                    </span>
                </span>
            ) : (
                <ChevronRight className={`
                    w-3.5 h-3.5 transition-all duration-300
                    ${isActive 
                        ? 'text-blue-400 opacity-100' 
                        : 'text-gray-600 opacity-0 group-hover:opacity-100 group-hover:text-gray-400'
                    }
                `} />
            )}

            {/* Hover gradient overlay */}
            <span className={`
                absolute inset-0 rounded-xl transition-opacity duration-300 pointer-events-none
                ${isActive 
                    ? 'opacity-100 bg-gradient-to-r from-blue-500/5 to-purple-500/5' 
                    : 'opacity-0 group-hover:opacity-100 bg-gradient-to-r from-white/[0.02] to-transparent'
                }
            `} />
        </Link>
    )
}

export default SideItems