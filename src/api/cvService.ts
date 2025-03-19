import api from "@/api/axiosConfig";

export interface JobApplication {
    jobId: number;
    jobTitle: string;
    companyName: string;
    status: string;
}

export interface CV {
    id: number;
    title: string;
    url: string;
    status: boolean;
    jobs?: JobApplication[];
    createdAt?: string;
    updatedAt?: string;
}

export interface ApiResponse<T> {
    message: string;
    status: number;
    data: T | null;
}

const cvService = {
    uploadCV: async (file: File, freelancerId: number): Promise<ApiResponse<string>> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('freelancerId', freelancerId.toString());

        const response = await api.post('/pdf/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return {
            message: response.message || 'Upload CV thành công',
            status: response.status,
            data: response.url
        };
    },

    getCVsByFreelancerId: async (freelancerId: number): Promise<ApiResponse<CV[]>> => {
        const response = await api.get(`/pdf/freelancer/${freelancerId}`);
        return {
            message: response.message || 'Lấy danh sách CV thành công',
            status: response.status,
            data: response.data
        };
    },

    deleteCV: async (cvId: number): Promise<ApiResponse<boolean>> => {
        const response = await api.delete(`/pdf/${cvId}`);
        return {
            message: response.message || 'Xóa CV thành công',
            status: response.status,
            data: true
        };
    },

    downloadCV: async (filePath: string): Promise<Blob> => {
        const response = await api.get(`/pdf/download?filePath=${encodeURIComponent(filePath)}`, {
            responseType: 'blob',
        });
        return response;
    },

    getPreviewUrl: (filePath: string): string => {
        return `${api.defaults.baseURL}/pdf/download?filePath=${encodeURIComponent(filePath)}`;
    },

    previewCV: async (filePath: string): Promise<string> => {
        try {
            const blob = await cvService.downloadCV(filePath);
            return URL.createObjectURL(blob);
        } catch (error) {
            console.error('Lỗi khi tạo preview CV:', error);
            throw error;
        }
    }
};

export default cvService;