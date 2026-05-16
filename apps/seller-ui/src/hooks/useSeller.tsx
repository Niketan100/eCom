
import axiosInstance from '../utils/axiosInstance'
import { useQuery } from '@tanstack/react-query'

const useSeller = () => {
     const { data: seller, isLoading, error } = useQuery<any>({
            queryKey: ['dashboardData'],
            queryFn: async () => {
               try {
                const res = await axiosInstance.get('/auth/logged-in-seller')
                return res.data?.seller ?? null
               } catch (err) {
                console.error('Error fetching dashboard data:', err)
                throw new Error('Failed to fetch dashboard data')
               }
            },


            
        })
  return (
    { seller, isLoading, error }
  )
}

export default useSeller