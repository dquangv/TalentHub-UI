import api from "@/api/axiosConfig";

interface Freelancer {
    id: number;
    name: string;
    hourlyRate: number;
    description: string;
    categoryName: string;
    userId: number;
    avatar: string;
    rating: number;
    skills: string[];
}

interface Category {
    id: number;
    categoryTitle: string;
}

interface ApiResponse<T> {
    message: string;
    status: number;
    data: T | null;
}

interface HourlyRateRequest {
    freelancerId: number;
    hourlyRate: number;
}

interface HourlyRateResponse {
    freelancerId: number;
    hourlyRate: number;
}

const freelancerService = {
    getFreelancerById: async (freelancerId: number): Promise<ApiResponse<Freelancer>> => {
        const response = await api.get(`/v1/freelancers/${freelancerId}`);
        return response;
    },

    updateHourlyRate: async (freelancerId: number, hourlyRate: number): Promise<ApiResponse<HourlyRateResponse>> => {
        const data: HourlyRateRequest = {
            freelancerId,
            hourlyRate
        };
        const response = await api.post('/v1/freelancers/updateHourlyRate', data);
        return response;
    },

    getAllCategories: async (): Promise<ApiResponse<Category[]>> => {
        const response = await api.get('/v1/categories');
        return response;
    },

    createCategory: async (categoryTitle: string): Promise<ApiResponse<Category>> => {
        const response = await api.post('/v1/categories', { categoryTitle });
        return response;
    },

    updateFreelancerCategory: async (freelancerId: number, categoryId: number): Promise<ApiResponse<Freelancer>> => {
        const response = await api.put(`/v1/freelancers/${freelancerId}/category/${categoryId}`);
        return response;
    }
};

export default freelancerService;
export type {
    Freelancer,
    Category,
    ApiResponse,
    HourlyRateRequest,
    HourlyRateResponse
};