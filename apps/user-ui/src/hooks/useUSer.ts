'use client';

import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import axiosInstance from "../utils/axiosInstance";


const fetchUser = async () => {
    try {
        const response = await axiosInstance.get('/auth/logged-in-user');
        return response.data as { user?: unknown };
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const status = (error as AxiosError).response?.status;
            if (status === 401 || status === 403) {
                return { user: null };
            }
            const message = (error as AxiosError<{ message?: string }>).response?.data?.message;
            throw new Error(message || 'Failed to fetch user data');
        }
        throw new Error('Failed to fetch user data');
    }
}

const useUser = () => {
    const { isLoading, data: loggedInUser, error } = useQuery({
        queryKey: ['loggedInUser'],
        queryFn: fetchUser,
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
        select: (data) => data?.user ?? null
    });
    return { loggedInUser, isLoading, error };
}

export default useUser; 
