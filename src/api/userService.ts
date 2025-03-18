import api from "@/api/axiosConfig";

interface User {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    title: string;
    introduction: string;
    image: string;
    role: string;
}

interface ApiResponse<T> {
    message: string;
    status: number;
    data: T | null;
}

interface ImageUploadResponse {
    url: string;
}

interface ChangePasswordRequest {
    email: string;
    currentPassword: string;
    newPassword: string;
}

interface ResetPasswordRequest {
    email: string;
    code: string;
    newPassword: string;
}

interface OtpResponse {
    message: string;
    success: boolean;
}

const userService = {
    getUserById: async (userId: number): Promise<ApiResponse<User>> => {
        const response = await api.get(`/users/${userId}`);
        return {
            message: response.statusText,
            status: response.status,
            data: response.data,
        };
    },

    updateUser: async (userId: number, userData: Partial<User>): Promise<ApiResponse<User>> => {
        const response = await api.put(`/users/${userId}`, userData);
        return {
            message: response.statusText,
            status: response.status,
            data: response.data,
        };
    },

    uploadImage: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/images/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return (response as unknown as ImageUploadResponse).url;
    },

    updateUserImage: async (userId: number, imageUrl: string): Promise<ApiResponse<User>> => {
        return await userService.updateUser(userId, { image: imageUrl });
    },

    changePassword: async (data: ChangePasswordRequest): Promise<ApiResponse<boolean>> => {
        const response = await api.post('/v1/account/change-password', data);
        return {
            message: response.data?.message || 'Mật khẩu đã được thay đổi',
            status: response.status,
            data: response.data?.data || true
        };
    },

    sendOtp: async (email: string): Promise<ApiResponse<string>> => {
        const response = await api.post(`/v1/account/send-otp?email=${encodeURIComponent(email)}`);
        return {
            message: response.data?.message || 'Đã gửi mã OTP',
            status: response.status,
            data: response.data?.data || `Đã gửi mã OTP đến ${email}`
        };
    },

    resetPassword: async (data: ResetPasswordRequest): Promise<ApiResponse<OtpResponse>> => {
        const response = await api.post('/v1/account/reset-password', data);
        return {
            message: response.data?.message || 'Đặt lại mật khẩu thành công',
            status: response.status,
            data: response.data?.data || { message: 'Mật khẩu đã được đặt lại', success: true }
        };
    }
};

export default userService;
export type {
    User,
    ApiResponse,
    ImageUploadResponse,
    ChangePasswordRequest,
    ResetPasswordRequest,
    OtpResponse
};