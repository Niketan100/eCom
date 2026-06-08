import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../utils/axiosInstance'

export type SellerNotification = {
  id: string
  sellerId: string
  type: 'ORDER_CREATED' | 'PRODUCT_VIEWED' | string
  title: string
  message: string
  data?: any
  readAt?: string | null
  createdAt?: string
}

type ListResponse = {
  success: boolean
  notifications: SellerNotification[]
}

type UnreadCountResponse = {
  success: boolean
  unreadCount: number
}

export const useNotifications = () => {
  return useQuery({
    queryKey: ['seller-notifications'],
    queryFn: async () => {
      const res = await axiosInstance.get<ListResponse>('/products/notifications')
      return res.data
    },
  })
}

export const useUnreadNotificationCount = () => {
  return useQuery({
    queryKey: ['seller-notifications-unread-count'],
    queryFn: async () => {
      const res = await axiosInstance.get<UnreadCountResponse>('/products/notifications/unread-count')
      return res.data
    },
    refetchInterval: 30_000,
  })
}

export const useMarkNotificationRead = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosInstance.patch(`/products/notifications/${id}/read`)
      return res.data
    },
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ['seller-notifications'] }),
        qc.invalidateQueries({ queryKey: ['seller-notifications-unread-count'] }),
      ])
    },
  })
}

export const useMarkAllNotificationsRead = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.patch('/products/notifications/read-all')
      return res.data
    },
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ['seller-notifications'] }),
        qc.invalidateQueries({ queryKey: ['seller-notifications-unread-count'] }),
      ])
    },
  })
}
