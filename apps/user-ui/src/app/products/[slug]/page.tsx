'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

import axiosInstance from 'apps/user-ui/src/utils/axiosInstance'
import PageShell from 'apps/user-ui/src/shared/components/PageShell'
import BasicProductLayout from './components/BasicProductLayout'
import BasicProductLayoutLoading from './components/BasicProductLayoutLoading'
import DetailedProductLayout from './components/DetailedProductLayout'

// ─── helpers ──────────────────────────────────────────────────────────────────

function hasContent(value: unknown): boolean {
   if (Array.isArray(value)) return value.length > 0
   if (value && typeof value === 'object') return Object.keys(value).length > 0
   return !!value
}

function isDetailed(p: any): boolean {
   return (
      hasContent(p?.features) ||
      hasContent(p?.highlights) ||
      hasContent(p?.variants) ||
      !!p?.brand ||
      !!p?.warranty ||
      !!p?.shippingWeight
   )
}

// ─── fallback views ────────────────────────────────────────────────────────────

function Notice({ title, body, detail }: { title: string; body?: string; detail?: string }) {
   return (
      <div className='max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl p-6 space-y-1'>
         <h1 className='text-xl font-semibold text-black'>{title}</h1>
         {body && <p className='text-sm text-gray-500'>{body}</p>}
         {detail && (
            <pre className='mt-3 text-xs text-gray-400 whitespace-pre-wrap break-words'>{detail}</pre>
         )}
      </div>
   )
}

// ─── page ──────────────────────────────────────────────────────────────────────

export default function ProductPage() {
   const params = useParams()
   const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug

   const { data, isLoading, isError, error } = useQuery({
      queryKey: ['product', slug],
      queryFn: async () => {
         const res = await axiosInstance.get(`/products/slug/${slug}`)
         return res.data as { success?: boolean; product?: any }
      },
      enabled: !!slug,
   })

   if (isLoading) return <PageShell><BasicProductLayoutLoading /></PageShell>

   if (isError) return (
      <PageShell>
         <Notice
            title="Couldn't load product"
            body='Please try again in a moment.'
            detail={String((error as any)?.message ?? error)}
         />
      </PageShell>
   )

   if (!data?.product) return (
      <PageShell>
         <Notice
            title='Product not found'
            body='This product may have been removed or the link is incorrect.'
         />
      </PageShell>
   )

   const product = data.product

   return (
      <PageShell>
         {isDetailed(product)
            ? <DetailedProductLayout product={product} />
            : <BasicProductLayout product={product} />}
      </PageShell>
   )
}