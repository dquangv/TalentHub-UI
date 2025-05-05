import axios from 'axios';
import { notification } from 'antd';
import config from '@/config';
const axiosInstance = axios.create({
    baseURL: config.current.API_URL,
    timeout: config.current.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
         "ngrok-skip-browser-warning": "true"
    }
});

// interceptor request
// axiosInstance.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('token');
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// interceptor response
axiosInstance.interceptors.response.use(
    (response) => {
        return response.data;
    },
    async (error) => {
        const { response } = error;
        const originalRequest = error.config;

        if (!window.navigator.onLine && !originalRequest._retry) {
            originalRequest._retry = true;

            const url = originalRequest.url;
            let staticDataPath = null;

            if (url.includes('statistics/home')) {
                staticDataPath = '/static-data/statistics.json';
            } else if (url.includes('/v1/jobs/top-6')) {
                staticDataPath = '/static-data/top-jobs.json';
            } else if (url.includes('/v1/banners')) {
                staticDataPath = '/static-data/banners.json';
            }
            if (staticDataPath) {
                try {
                    console.log(`Falling back to static data: ${staticDataPath}`);
                    const response = await fetch(staticDataPath);
                    const data = await response.json();
                    return { data };
                } catch (fallbackError) {
                    console.error('Error fetching fallback data:', fallbackError);
                }
            }
        }

        if (response) {
            switch (response.status) {
                case 400:

                    break;

                case 401:
                    notification.warning({
                        message: 'Phiên đăng nhập hết hạn',
                        description: 'Vui lòng đăng nhập lại'
                    });
                    // chuyển hướng đến trang login
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    break;

                case 403:
                    notification.error({
                        message: 'Không có quyền truy cập',
                        description: 'Bạn không có quyền thực hiện hành động này'
                    });
                    break;

                case 404:
                    notification.error({
                        message: 'Không tìm thấy',
                        description: 'Tài nguyên không tồn tại'
                    });
                    break;

                case 500:
                   
                    break;

                case 417:
                    break;

                default:
                    notification.error({
                        message: 'Có lỗi xảy ra',
                        description: response.data.message || 'Vui lòng thử lại'
                    });
            }
        } else {
            // lỗi mạng
            notification.error({
                message: 'Lỗi kết nối',
                description: 'Không thể kết nối đến server, vui lòng kiểm tra lại kết nối mạng'
            });
        }

        return Promise.reject(error);
    }
);

// API methods
const api = {
    get: (url: string, config = {}) => axiosInstance.get(url, config),
    post: (url: string, data?: any, config = {}) => axiosInstance.post(url, data, config),
    put: (url: string, data?: any, config = {}) => axiosInstance.put(url, data, config),
    delete: (url: string, config = {}) => axiosInstance.delete(url, config),
    patch: (url: string, data?: any, config = {}) => axiosInstance.patch(url, data, config)
};

// cách sử dụng
// import api from './api/axiosConfig';
// const fetchData = async () => {
//     try {
//       const response = await api.get('/users'); (hoặc post, put, delete, patch)
//       console.log(response);
//     } catch (error) {
//       
//       console.log(error);
//     }
//   };


export default api;