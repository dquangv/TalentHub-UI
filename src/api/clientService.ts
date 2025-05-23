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

interface Company {
    id?: number;
    companyName: string;
    address: string;
    phoneContact: string;
    industry: string;
    clientId?: number;
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

    // New company-related APIs
    getClientCompanies: async (clientId: number): Promise<ApiResponse<Company[]>> => {
        try {
            const response = await api.get(`/v1/clients/${clientId}/companies`);
            return {
                message: response.message || 'Companies retrieved successfully',
                status: response.status,
                data: response.data,
            };
        } catch (error) {
            throw error;
        }
    },

    createCompany: async (companyData: Company): Promise<ApiResponse<Company>> => {
        try {
            const response = await api.post('/v1/companies', companyData);
            return {
                message: response.message || 'Company created successfully',
                status: response.status,
                data: response.data,
            };
        } catch (error) {
            throw error;
        }
    },

    updateCompany: async (companyId: number, companyData: Omit<Company, 'clientId'>): Promise<ApiResponse<Company>> => {
        try {
            const response = await api.put(`/v1/companies/${companyId}`, companyData);
            return {
                message: response.message || 'Company updated successfully',
                status: response.status,
                data: response.data,
            };
        } catch (error) {
            throw error;
        }
    },

    deleteCompany: async (companyId: number): Promise<ApiResponse<null>> => {
        try {
            const response = await api.delete(`/v1/companies/${companyId}`);
            return {
                message: response.message || 'Company deleted successfully',
                status: response.status,
                data: null,
            };
        } catch (error) {
            throw error;
        }
    }
};

export default clientService;
export type {
    Client,
    Company,
    ApiResponse,
    ClientPriceUpdateRequest
};