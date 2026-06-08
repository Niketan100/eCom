'use client'

import { useParams } from 'next/navigation'

import { useQuery } from '@tanstack/react-query'

import axiosInstance from 'apps/user-ui/src/utils/axiosInstance'

import BasicProductLayout from './components/BasicProductLayout'

import DetailedProductLayout from './components/DetailedProductLayout'
import BasicProductLayoutLoading from './components/BasicProductLayoutLoading'
import PageShell from 'apps/user-ui/src/shared/components/PageShell'

const ProductPage = () => {


   const params = useParams()

   const slugParam = params.slug
   const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam

   const { data, isLoading, isError, error } = useQuery({

      queryKey: ['product', slug],

      queryFn: async () => {

         const response = await axiosInstance.get(`/products/slug/${slug}`)
         return response.data as { success?: boolean; product?: any }

      },

      enabled: !!slug

   })

   // Route-level skeleton is handled by `loading.tsx`.
   // Keep this only as a very small fallback.
   if (isLoading) {
      return (
         <PageShell>
            <BasicProductLayoutLoading />
         </PageShell>
      )
   }

   if (isError) {
      return (
         <PageShell>
            <div className='max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl p-6'>
               <h1 className='text-2xl font-bold text-black'>
                  Couldn’t load product
               </h1>
               <p className='text-gray-600 mt-2'>
                  Please try again in a moment.
               </p>
               <pre className='mt-4 text-xs text-gray-400 whitespace-pre-wrap break-words'>
                  {String((error as any)?.message ?? error)}
               </pre>
            </div>
         </PageShell>
      )
   }

   if (!data?.product) {
      return (
         <PageShell>
            <div className='max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl p-6'>
               <h1 className='text-2xl font-bold text-black'>Product not found</h1>
               <p className='text-gray-600 mt-2'>
                  This product may have been removed or the link is incorrect.
               </p>
            </div>
         </PageShell>
      )
   }

   const product = data?.product

   const hasFeatures =
      Array.isArray(product?.features)
         ? product.features.length > 0
         : !!product?.features && Object.keys(product.features).length > 0

   const isDetailedProduct =

      hasFeatures ||

      product?.highlights?.length > 0 ||

      product?.variants?.length > 0 ||

      product?.brand ||

      product?.warranty ||

      product?.shippingWeight

   return (
      <PageShell>
         {isDetailedProduct ? (
            <DetailedProductLayout product={product} />
         ) : (
            <BasicProductLayout product={product} />
         )}
      </PageShell>
   )

}

export default ProductPage