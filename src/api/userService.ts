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
}

interface ApiResponse<T> {
    message: string;
    status: number;
    data: T | null;
}

interface ImageUploadResponse {
    url: string;
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
    }
};

export default userService;
export type { User, ApiResponse, ImageUploadResponse };