
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
                // If not logged in, just return null so the dashboard layout can redirect.
                if ((err as any)?.response?.status === 401 || (err as any)?.response?.status === 403) {
                  return null
                }
                console.error('Error fetching dashboard data:', err)
                throw err
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