import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6001',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

let isRefreshing = false;
let refreshSubscribers: ((error: Error | null) => void)[] = [];

const handleLogout = () => {
    if (window.location.pathname !== '/login') {
        window.location.href = '/login';
    }
};

const subscribeRefreshToken = (cb: (error: Error | null) => void) => {
    refreshSubscribers.push(cb);
};

// Notify all subscribers — pass error if refresh failed
const onRefreshed = (error: Error | null = null) => {
    refreshSubscribers.forEach((cb) => cb(error));
    refreshSubscribers = [];
};

axiosInstance.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // ✅ Never try to refresh if the refresh endpoint itself failed
        const isRefreshEndpoint = originalRequest.url?.includes('/auth/refresh-token');

        if (
            (error.response?.status === 401 || error.response?.status === 403)
            && !originalRequest._retry
            && !isRefreshEndpoint  // ✅ add this
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    subscribeRefreshToken((err) => {
                        if (err) reject(err);
                        else resolve(axiosInstance(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await axiosInstance.post('/auth/refresh-token');
                onRefreshed(null);
                return axiosInstance(originalRequest);
            } catch (err) {
                onRefreshed(err as Error);
                handleLogout();
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;