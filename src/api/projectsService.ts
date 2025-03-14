import api from "@/api/axiosConfig";

interface Project {
    id: number;
    title: string;
    tech: string;
    description: string;
    link: string;
    image: string;
    freelancerId: number;
    freelancerName?: string | null;
}

interface ApiResponse<T> {
    message: string;
    status: number;
    data: T | null;
}

interface ImageUploadResponse {
    message: string;
    url: string;
    status: number;
}

const projectsService = {
    getProjectsByFreelancerId: async (freelancerId: number): Promise<ApiResponse<Project[]>> => {
        const response = await api.get(`/v1/projects/freelancer/${freelancerId}`);
        return response as unknown as ApiResponse<Project[]>;
    },

    createProject: async (project: Omit<Project, 'id' | 'freelancerName'>): Promise<ApiResponse<Project>> => {
        const response = await api.post('/v1/projects', project);
        return response as unknown as ApiResponse<Project>;
    },

    updateProject: async (projectId: number, project: Omit<Project, 'id' | 'freelancerName'>): Promise<ApiResponse<Project>> => {
        const response = await api.put(`/v1/projects/${projectId}`, project);
        return response as unknown as ApiResponse<Project>;
    },
    deleteProject: async (projectId: number): Promise<ApiResponse<boolean>> => {
        const response = await api.delete(`/v1/projects/${projectId}`);
        return response as unknown as ApiResponse<boolean>;
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

    updateImage: async (oldUrl: string, newFile: File): Promise<string> => {
        const formData = new FormData();
        formData.append('oldUrl', oldUrl);
        formData.append('newFile', newFile);

        const response = await api.put('/images/update', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response as unknown as string;
    }
};

export default projectsService;
export type {
    Project,
    ApiResponse,
    ImageUploadResponse
};