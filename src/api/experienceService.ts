import api from "@/api/axiosConfig";

interface Experience {
    id?: number;
    companyName: string;
    position: string;
    startDate: string;
    endDate: string | null;
    description: string;
    status: string;
    freelancer?: any;
    freelancerId?: number;
}

interface ApiResponse<T> {
    message: string;
    status: number;
    data: T | null;
}

const experienceService = {
    getFreelancerExperiences: async (freelancerId: number): Promise<ApiResponse<Experience[]>> => {
        const response = await api.get(`/v1/experiences/${freelancerId}`);
        return {
            message: response.message || "Thành công!",
            status: response.status,
            data: response.data,
        };
    },

    createExperience: async (experienceData: Experience): Promise<ApiResponse<Experience>> => {
        const response = await api.post('/v1/experiences', experienceData);
        return {
            message: response.message || "Thành công!",
            status: response.status,
            data: response.data,
        };
    },

    updateExperience: async (experienceId: number, experienceData: Partial<Experience>): Promise<ApiResponse<Experience>> => {
        // Đảm bảo dữ liệu phù hợp với API backend
        const updateData: Partial<Experience> = {
            ...experienceData,
            // Nếu đang cập nhật trạng thái hiện tại (endDate = null), đảm bảo gửi null thay vì undefined
            endDate: 'endDate' in experienceData ? (experienceData.endDate === null ? null : experienceData.endDate) : undefined
        };

        const response = await api.put(`/v1/experiences/${experienceId}`, updateData);
        return {
            message: response.message || "Thành công!",
            status: response.status,
            data: response.data,
        };
    },

    deleteExperience: async (experienceId: number): Promise<ApiResponse<boolean>> => {
        const response = await api.delete(`/v1/experiences/${experienceId}`);
        return {
            message: response.message || "Thành công!",
            status: response.status,
            data: response.data,
        };
    }
};

export default experienceService;
export type { Experience, ApiResponse };