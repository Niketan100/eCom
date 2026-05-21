
import axiosInstance from '../utils/axiosInstance'
import { useQuery } from '@tanstack/react-query'

const useSeller = () => {
     const { data: seller, isLoading, error } = useQuery({
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

        const customers = seller?.customers || [];
        const totalCustomers = customers.length;
        const recentCustomers = customers.slice(0, 5);
  return (
    { seller, isLoading, error, customers, totalCustomers, recentCustomers }
  )
}

export default useSeller