'use client'

import React from 'react'

type SkeletonProps = {
  className?: string
}

// A small reusable skeleton with a subtle shimmer.
// Tailwind-only (no extra deps).
const Skeleton = ({ className = '' }: SkeletonProps) => {
  return (
    <div
      className={
        `relative overflow-hidden rounded-md bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 ${className}`
      }
    >
      <div className='absolute inset-0 -translate-x-full animate-[shimmer_1.35s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent' />
    </div>
  )
}

export default Skeleton
