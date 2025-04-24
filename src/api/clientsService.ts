import api from "@/api/axiosConfig";

interface ActiveClient {
    clientId: number;
    fromPrice: number;
    toPrice: number;
    jobsCount: number;
    firstName: string;
    lastName: string;
    province: string;
    country: string;
    title: string;
    introduction: string;
    image: string;
    email: string;
    averageRating: number;
    userId: number;
    companies: {
        id: number;
        companyName: string;
        address: string;
        phoneContact: string;
        industry: string;
        clientId: number;
    }[];
}

interface ClientDetail extends ActiveClient {
    reviews: {
        id: number;
        rating: number;
        note: string;
        reviewerName: string;
        projectTitle: string;
        projectStartDate: string;
        projectDuration: number;
        projectBudget: number;
        freelancerAvatar: string;
    }[];
}

interface ApiResponse<T> {
    message: string;
    status: number;
    data: T;
}

const clientsService = {
    getActiveClients: async (): Promise<ApiResponse<ActiveClient[]>> => {
        const response = await api.get('/v1/clients/active');
        return response;
    },

    getClientDetail: async (clientId: number): Promise<ApiResponse<ClientDetail>> => {
        const response = await api.get(`/v1/clients/${clientId}/detail`);
        return response;
    }
};

export default clientsService;
export type {
    ActiveClient,
    ClientDetail,
    ApiResponse
};