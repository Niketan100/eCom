import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';


const useOrder = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await axiosInstance.get('/products/get-orders')
      return res.data
    },
  })

  const orders = useMemo(() => {
    if (!data?.orders) return [];
    return data.orders.map((order: any) => ({
      id: order.id,
      customer: order.user?.name,
      product: order.product?.name,
      amount: `₹${Number(order.product?.price || 0).toFixed(2)}`,
      payment: order.payment.status,
      status: order.status,
      date: new Date(order.createdAt).toLocaleDateString(),
    }))
  }, [data?.orders])

  const total_orders = data?.count || 0;
  const pending_orders = data?.orders?.filter((order: any) => order.status === 'PENDING').length || 0;
  const delivered_orders = data?.orders?.filter((order: any) => order.status === 'DELIVERED').length || 0;
  const paid_orders_data = data?.orders?.filter((order: any) => order.payment.status === 'PAID') || [];  
  const revenue = paid_orders_data.reduce((acc: number, order: any) => acc + (order.product?.price || 0), 0) || 0;
  const ordersToday = data?.orders?.filter((order: any) => {
    const orderDate = new Date(order.createdAt);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  }).length || 0;

  const percentage_order_today = ((ordersToday/total_orders)*100).toFixed(2) || 0;
  const RevenueToday = data?.orders?.filter((order: any) => {
    const orderDate = new Date(order.createdAt);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString() && order.status === 'DELIVERED';
  }).reduce((acc: number, order: any) => acc + (order.product?.price || 0), 0) || 0;

  const percentage_revenue_today = ((RevenueToday/revenue)*100).toFixed(2) || 0;
const ordersCountDaywise = useMemo(() => {
  if (!data?.orders) return [];

  const grouped = data.orders.reduce(
    (acc: Record<string, number>, order: any) => {
      const dateKey = new Date(order.createdAt).toLocaleDateString();

      acc[dateKey] = (acc[dateKey] || 0) + 1;

      return acc;
    },
    {}
  );

  return Object.entries(grouped).map(([date, count]) => ({
    date,
    orders: Number(count),
  }));
}, [data?.orders]);

  const unique_customers = data?.orders?.reduce((acc: Set<string>, order: any) => {
    if (order.user?.name) {
      acc.add(order.user.name);
    }
    return acc;
  }, new Set()) || new Set();

  const total_customers = unique_customers.size;

  const customerAddedToday = data?.orders?.some((order: any) => {
    const orderDate = new Date(order.createdAt);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString() && order.user?.name && !unique_customers.has(order.user.name);
  }) || false;

  const percentage_customers_today = customerAddedToday ? ((1/total_customers)*100).toFixed(2) : '0.00';


  
  return (
    {
        orders,
        isLoading,
        error,
        total_orders,
        pending_orders,
        delivered_orders,
        paid_orders_data,
        revenue,
        percentage_order_today,
        percentage_revenue_today,
        total_customers,
        percentage_customers_today,
        ordersCountDaywise
    }
  )
}

export default useOrder