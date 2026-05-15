import axios from 'axios';

const axiosInstance = axios.create({
    baseURL : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6001',
    headers : {     
        'Content-Type' : 'application/json'
    },
    withCredentials : true
});

let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

// hanlde logout and infite loop

const handleLogout = () => {
    if(window.location.pathname !== '/login'){
        window.location.href = '/login';
    }
}

const subscribeRefreshToken = (cb: () => void) => {
    refreshSubscribers.push(cb);
}

const onRefreshed = () => {
    refreshSubscribers.forEach((cb) => cb());
    refreshSubscribers = [];
}

axiosInstance.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config; 
        const status = error.response?.status;
        const isAuthFailure = status === 401 || status === 403;
        const isRefreshRequest = originalRequest?.url?.includes('/auth/refresh-token');

        if (isAuthFailure && !originalRequest._retry && !isRefreshRequest) {
            if (isRefreshing) {
                return new Promise((resolve) => {
                    subscribeRefreshToken(() => {
                        resolve(axiosInstance(originalRequest));
                    });
                });
            }
            originalRequest._retry = true;
            isRefreshing = true;
            try {
                await axiosInstance.post('/auth/refresh-token');
                onRefreshed();
                return axiosInstance(originalRequest);
            } catch (err) {
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