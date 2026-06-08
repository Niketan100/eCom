'use client'

import React from 'react'
import Link from 'next/link'

import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from 'apps/seller-ui/src/hooks/useNotifications'

const formatTime = (iso?: string) => {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString()
}

export default function NotificationsPage() {
  const { data, isLoading, error } = useNotifications()
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()

  const notifications = data?.notifications ?? []

  return (
    <div className='min-h-[calc(100vh-120px)]'>
      <div className='flex items-start justify-between gap-4 mb-6'>
        <div>
          <h1 className='text-2xl font-semibold text-gray-900'>Notifications</h1>
          <p className='text-sm text-gray-500 mt-1'>Order and product activity updates.</p>
        </div>

        <button
          className='px-4 py-2 rounded-xl bg-black text-white text-sm font-medium disabled:opacity-60'
          onClick={() => markAllRead.mutate()}
          disabled={markAllRead.isPending || notifications.length === 0}
        >
          Mark all as read
        </button>
      </div>

      {isLoading ? (
        <div className='bg-white border border-gray-200 rounded-2xl p-6 text-gray-600'>Loading…</div>
      ) : error ? (
        <div className='bg-white border border-red-200 rounded-2xl p-6 text-red-700'>
          Failed to load notifications.
        </div>
      ) : notifications.length === 0 ? (
        <div className='bg-white border border-gray-200 rounded-2xl p-10 text-center'>
          <div className='text-gray-800 font-medium'>No notifications yet</div>
          <div className='text-sm text-gray-500 mt-2'>New orders and views will appear here.</div>
        </div>
      ) : (
        <div className='space-y-3'>
          {notifications.map((n) => {
            const unread = !n.readAt
            const productHref = n?.data?.slug ? `/dashboard/manage-products` : undefined

            return (
              <div
                key={n.id}
                className={
                  'bg-white border rounded-2xl p-5 flex gap-4 items-start justify-between ' +
                  (unread ? 'border-black/20' : 'border-gray-200')
                }
              >
                <div className='min-w-0'>
                  <div className='flex items-center gap-3'>
                    <div
                      className={
                        'h-2.5 w-2.5 rounded-full ' + (unread ? 'bg-[#d7ff3f]' : 'bg-gray-300')
                      }
                    />
                    <div className='text-sm font-semibold text-gray-900 truncate'>{n.title}</div>
                    <div className='text-xs text-gray-400'>{formatTime(n.createdAt)}</div>
                  </div>

                  <div className='text-sm text-gray-700 mt-2 leading-relaxed'>{n.message}</div>

                  {productHref && (
                    <div className='mt-3'>
                      <Link href={productHref} className='text-sm text-blue-600 hover:underline'>
                        View product
                      </Link>
                    </div>
                  )}
                </div>

                <button
                  className='px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-60'
                  onClick={() => markRead.mutate(n.id)}
                  disabled={!unread || markRead.isPending}
                >
                  {unread ? 'Mark read' : 'Read'}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
