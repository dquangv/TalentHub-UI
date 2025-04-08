import axios from 'axios';
import { notification } from 'antd';

const ENV = {
    development: {
        API_URL: 'http://localhost:8080/api',
        TIMEOUT: 30000,
    },
    production: {
        API_URL: 'https://elected-playstation-due-enhanced.trycloudflare.com/api',
        TIMEOUT: 30000,
    }
};

// config môi trường
const config = ENV[process.env.NODE_ENV || 'development'];

// instance axios
const axiosInstance = axios.create({
    baseURL: config.API_URL,
    timeout: config.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
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
    (error) => {
        const { response } = error;

        if (response) {
            switch (response.status) {
                case 400:
                    notification.error({
                        message: 'Lỗi dữ liệu',
                        description: response.data.message || 'Dữ liệu không hợp lệ'
                    });
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
                    notification.error({
                        message: 'Lỗi hệ thống',
                        description: 'Đã có lỗi xảy ra, vui lòng thử lại sau'
                    });
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