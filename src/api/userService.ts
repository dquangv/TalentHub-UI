import api from "@/api/axiosConfig";

interface User {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    country: string | null;
    province: string | null;
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
    getUserById: async (userId: number): Promise<User> => {
        try {
            const response = await api.get(`/users/${userId}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    updateUser: async (userId: number, userData: Partial<User>): Promise<User> => {
        console.log('Sending user data to server:', userData);
        try {
            const response = await api.put(`/users/${userId}`, userData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    uploadImage: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/images/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.url;
        } catch (error) {
            throw error;
        }
    },

    updateUserImage: async (userId: number, imageUrl: string): Promise<User> => {
        return await userService.updateUser(userId, { image: imageUrl });
    },

    changePassword: async (data: ChangePasswordRequest): Promise<any> => {
        try {
            const response = await api.post('/v1/account/change-password', data);
            return response;
        } catch (error) {
            throw error;
        }
    },

    sendOtp: async (email: string): Promise<any> => {
        try {
            const response = await api.post(`/v1/account/send-otp?email=${encodeURIComponent(email)}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    resetPassword: async (data: ResetPasswordRequest): Promise<any> => {
        try {
            const response = await api.post('/v1/account/reset-password', data);
            return response;
        } catch (error) {
            throw error;
        }
    },

    getLocationDisplay: (country: string | null, province: string | null): string => {
        const parts = [];

        if (province) {
            parts.push(province);
        }

        if (country) {
            parts.push(country);
        }

        return parts.join(', ');
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