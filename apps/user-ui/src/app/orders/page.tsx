 'use client'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '../../utils/axiosInstance'
import Skeleton from 'apps/user-ui/src/shared/components/Skeleton'
import PageShell from 'apps/user-ui/src/shared/components/PageShell'

const StatusPill = ({
    label,
    tone,
}: {
    label: string
    tone: 'gray' | 'green' | 'yellow' | 'red' | 'blue'
}) => {
    const tones: Record<typeof tone, string> = {
        gray: 'bg-gray-100 text-gray-700',
        green: 'bg-green-100 text-green-700',
        yellow: 'bg-yellow-100 text-yellow-700',
        red: 'bg-red-100 text-red-700',
        blue: 'bg-blue-100 text-blue-700',
    }

    return (
        <span
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${tones[tone]}`}
        >
            {label}
        </span>
    )
}

const formatMoney = (v: any) => {
    const n = Number(v)
    if (Number.isNaN(n)) return '0'
    return n.toLocaleString('en-IN', { maximumFractionDigits: 0 })
}

const safeDate = (value: any) => {
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return ''
    return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    })
}

const getOrderStatusTone = (status?: string) => {
    const s = String(status || '').toUpperCase()
    if (s === 'DELIVERED') return 'green'
    if (s === 'CONFIRMED' || s === 'SHIPPED') return 'blue'
    if (s === 'PENDING' || s === 'IN_REVIEW') return 'yellow'
    if (s === 'CANCELLED' || s === 'FAILED' || s === 'REJECTED') return 'red'
    return 'gray'
}

const getPaymentTone = (status?: string) => {
    const s = String(status || '').toUpperCase()
    if (s === 'PAID') return 'green'
    if (s === 'PENDING') return 'yellow'
    if (s === 'FAILED' || s === 'REFUNDED') return 'red'
    return 'gray'
}

const page = () => {

    const getOrders = useQuery({
        queryKey: ['orders'],
        queryFn: async () => {
            const response = await axiosInstance.get('/products/user-orders')
            return response.data as { orders: any[] }
        }
    })

    const orders = getOrders.data?.orders || []

    return (
        <PageShell>
            <div className='max-w-6xl mx-auto'>

                {/* Header */}
                <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8'>
                    <div>
                        <h1 className='text-4xl font-bold tracking-tight text-black'>
                            My Orders
                        </h1>
                        <p className='text-gray-500 mt-2'>
                            Track your purchases, payment status, and delivery progress.
                        </p>
                    </div>

                    <div className='flex items-center gap-3'>
                        <StatusPill label={`Total: ${orders.length}`} tone='gray' />
                        <StatusPill
                            label={`Delivered: ${orders.filter((o) => String(o?.status).toUpperCase() === 'DELIVERED').length}`}
                            tone='green'
                        />
                        <StatusPill
                            label={`Pending: ${orders.filter((o) => String(o?.status).toUpperCase() === 'PENDING').length}`}
                            tone='yellow'
                        />
                    </div>
                </div>

                {/* Content */}
                {getOrders.isLoading ? (

                    <div className='space-y-5'>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div
                                key={i}
                                className='bg-white border border-gray-200 rounded-[28px] p-5 shadow-sm'
                            >
                                <div className='flex flex-col sm:flex-row gap-5'>
                                    <Skeleton className='h-28 w-28 rounded-[24px]' />
                                    <div className='flex-1'>
                                        <Skeleton className='h-6 w-2/3 rounded' />
                                        <Skeleton className='h-4 w-1/2 rounded mt-3' />
                                        <div className='flex flex-wrap gap-3 mt-5'>
                                            <Skeleton className='h-8 w-24 rounded-full' />
                                            <Skeleton className='h-8 w-32 rounded-full' />
                                            <Skeleton className='h-8 w-28 rounded-full' />
                                        </div>
                                    </div>
                                    <div className='sm:text-right'>
                                        <Skeleton className='h-8 w-28 rounded ml-auto' />
                                        <Skeleton className='h-4 w-36 rounded mt-3 ml-auto' />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                ) : getOrders.isError ? (

                    <div className='bg-white border border-red-200 rounded-[28px] p-6 shadow-sm'>
                        <h2 className='text-xl font-bold text-black'>
                            Failed to load orders
                        </h2>
                        <p className='text-gray-600 mt-2'>
                            Please refresh the page. If it still fails, try logging in again.
                        </p>
                    </div>

                ) : orders.length === 0 ? (

                    <div className='bg-white border border-gray-200 rounded-[28px] p-10 shadow-sm flex flex-col items-center text-center'>
                        <div className='text-6xl'>📦</div>
                        <h2 className='text-2xl font-bold text-black mt-4'>
                            No orders yet
                        </h2>
                        <p className='text-gray-600 mt-2 max-w-xl'>
                            When you place an order, it’ll show up here with full tracking details.
                        </p>
                    </div>

                ) : (

                    <div className='space-y-5'>
                        {orders.map((order: any) => {
                            const product = order?.product
                            const imageUrl =
                                product?.images?.[0]?.url ||
                                product?.image?.url ||
                                product?.imageUrl ||
                                null

                            const quantity = Number(order?.quantity ?? 1)
                            const unitPrice = Number(order?.product?.discountedPrice ?? order?.product?.price ?? order?.totalPrice ?? 0)
                            const total = Number(order?.totalPrice ?? unitPrice * quantity)

                            return (
                                <div
                                    key={order?.id}
                                    className='bg-white border border-gray-200 rounded-[28px] p-5 shadow-sm hover:shadow-md transition-shadow'
                                >
                                    <div className='flex flex-col md:flex-row gap-5 md:items-center md:justify-between'>

                                        {/* Left */}
                                        <div className='flex gap-5 items-start'>
                                            <div className='w-28 h-28 rounded-[24px] bg-[#f3f4f6] overflow-hidden flex items-center justify-center text-3xl'>
                                                {imageUrl ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={imageUrl}
                                                        alt={product?.name || 'Product'}
                                                        className='w-full h-full object-cover'
                                                    />
                                                ) : (
                                                    <span>🛍️</span>
                                                )}
                                            </div>

                                            <div className='min-w-0'>
                                                <h3 className='text-xl font-bold text-black truncate max-w-[520px]'>
                                                    {product?.name || 'Unknown Product'}
                                                </h3>

                                                <div className='flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-500'>
                                                    <span className='inline-flex items-center gap-2'>
                                                        <span className='w-1.5 h-1.5 rounded-full bg-gray-300' />
                                                        Order ID: {String(order?.id || '').slice(-8) || '—'}
                                                    </span>
                                                    {order?.createdAt && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{safeDate(order.createdAt)}</span>
                                                        </>
                                                    )}
                                                </div>

                                                <div className='flex flex-wrap gap-3 mt-4'>
                                                    <StatusPill
                                                        label={`Order: ${order?.status ?? '—'}`}
                                                        tone={getOrderStatusTone(order?.status) as any}
                                                    />
                                                    <StatusPill
                                                        label={`Payment: ${order?.paymentStatus ?? order?.payment?.status ?? '—'}`}
                                                        tone={getPaymentTone(order?.paymentStatus ?? order?.payment?.status) as any}
                                                    />
                                                    <StatusPill
                                                        label={`Qty: ${Number.isFinite(quantity) ? quantity : 1}`}
                                                        tone='gray'
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right */}
                                        <div className='md:text-right'>
                                            <p className='text-sm text-gray-500'>Total</p>
                                            <p className='text-2xl font-extrabold text-[#F97316] mt-1'>
                                                ₹{formatMoney(total)}
                                            </p>
                                            <p className='text-xs text-gray-400 mt-2'>
                                                Unit: ₹{formatMoney(unitPrice)}
                                            </p>
                                        </div>

                                    </div>
                                </div>
                            )
                        })}
                    </div>

                )}

            </div>
        </PageShell>
    )
}

export default page