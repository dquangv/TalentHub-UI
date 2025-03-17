import api from "@/api/axiosConfig";

interface Client {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    title: string;
    introduction: string;
    companyName: string;
    phoneContact: string;
    companyAddress: string;
    industry: string;
    fromPrice: number;
    toPrice: number;
    typePrice: string;
    avatar?: string;
}

interface ApiResponse<T> {
    message: string;
    status: number;
    data: T | null;
}

interface ClientPriceUpdateRequest {
    clientId: number;
    fromPrice: number;
    toPrice: number;
    typePrice: string;
}

const clientService = {
    getClientById: async (clientId: number): Promise<ApiResponse<Client>> => {
        const response = await api.get(`/v1/clients/${clientId}`);
        return {
            message: response.statusText,
            status: response.status,
            data: response.data,
        };
    },

    updateClient: async (clientId: number, clientData: Partial<Client>): Promise<ApiResponse<Client>> => {
        const response = await api.put(`/v1/clients/${clientId}`, clientData);
        return {
            message: response.statusText,
            status: response.status,
            data: response.data,
        };
    },

    updateClientPrice: async (priceData: ClientPriceUpdateRequest): Promise<ApiResponse<ClientPriceUpdateRequest>> => {
        const response = await api.put('/v1/clients/updatePrice', priceData);
        return {
            message: response.message || 'Client price updated successfully',
            status: response.status,
            data: response.data,
        };
    },

    uploadClientImage: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/images/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.url;
    },
};

export default clientService;
export type {
    Client,
    ApiResponse,
    ClientPriceUpdateRequest
};