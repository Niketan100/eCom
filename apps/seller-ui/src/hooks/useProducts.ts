import { useQuery } from '@tanstack/react-query'

import axiosInstance from '../utils/axiosInstance'

export type SellerProduct = {
  id: string
  name: string
  price: number
  discountedPrice?: number | null
  stock: number
  slug?: string | null
  category?: string | null
  createdAt?: string | Date
}

type ProductsResponse = {
  success?: boolean
  products?: SellerProduct[]
  count?: number
}

const useProducts = () => {
  const { data, isLoading, error } = useQuery<ProductsResponse>({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await axiosInstance.get('/products/get-products')
      return response.data
    },
  })

  const products = data?.products ?? []
  const lowStockProducts = products.filter((product) => (product?.stock ?? 0) < 10)

  return {
    products,
    lowStockProducts,
    isLoading,
    error,
  }
}

export default useProducts
