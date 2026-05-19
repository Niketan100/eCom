'use client'

import { useParams } from 'next/navigation'

import { useQuery } from '@tanstack/react-query'

import axiosInstance from 'apps/user-ui/src/utils/axiosInstance'

import BasicProductLayout from './components/BasicProductLayout'

import DetailedProductLayout from './components/DetailedProductLayout'

const ProductPage = () => {


   const params = useParams()

   const slug = params.slug

   const { data, isLoading } = useQuery({

      queryKey: ['product', slug],

      queryFn: async () => {

         const response =
            await axiosInstance.get(
               `/products/slug/${slug}`
            )

         return response.data

      },

      enabled: !!slug

   })

   if (isLoading) {

      return (
         <div>
            Loading...
         </div>
      )

   }

   const product = data?.product
   console.log('Fetched Product:', product)

   const isDetailedProduct =

      product?.features?.length > 0 ||

      product?.highlights?.length > 0 ||

      product?.variants?.length > 0 ||

      product?.brand ||

      product?.warranty ||

      product?.shippingWeight

   return isDetailedProduct ? (

      <DetailedProductLayout
         product={product}
      />

   ) : (

      <BasicProductLayout
         product={product}
      />

   )

}

export default ProductPage