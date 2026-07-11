'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';

export interface LoggedInUser {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  following: string[];
  phone : number,
  createdAt: string;
  updatedAt: string;
}

const fetchUser = async (): Promise<{ user: LoggedInUser | null }> => {
  try {
    const { data } = await axiosInstance.get<{ user: LoggedInUser | null }>(
      '/auth/logged-in-user'
    );

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 401 || status === 403) {
        return { user: null };
      }

      throw new Error(
        (error.response?.data as { message?: string })?.message ??
          'Failed to fetch user data'
      );
    }

    throw new Error('Failed to fetch user data');
  }
};

const useUser = () => {
  const {
    data: loggedInUser,
    isLoading,
    error,
  } = useQuery<
    { user: LoggedInUser | null }, // queryFn return type
    Error,                         // error type
    LoggedInUser | null            // selected type
  >({
    queryKey: ['loggedInUser'],
    queryFn: fetchUser,
    retry: 5,
    refetchOnWindowFocus: false,
    select: (data) => data.user,
  });

  return {
    loggedInUser,
    isLoading,
    error,
  };
};

export default useUser;