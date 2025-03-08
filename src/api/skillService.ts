import api from "@/api/axiosConfig";

interface Skill {
    id: number;
    skillName: string;
}

interface FreelancerSkill {
    id: number;
    freelancerId: number;
    skillId: number;
    skillName: string;
}

interface ApiResponse<T> {
    message: string;
    status: number;
    data: T | null;
}

const skillService = {
    getAllSkills: async (): Promise<ApiResponse<Skill[]>> => {
        const response = await api.get('/v1/jobs/skills');
        return {
            message: response.statusText,
            status: response.status,
            data: response.data,
        };
    },

    getFreelancerSkills: async (freelancerId: number): Promise<ApiResponse<FreelancerSkill[]>> => {
        const response = await api.get(`/v1/freelancer-skills/freelancer/${freelancerId}`);
        return {
            message: response.statusText,
            status: response.status,
            data: response.data,
        };
    },

    addSkillToFreelancer: async (freelancerId: number, skillId: number): Promise<ApiResponse<FreelancerSkill>> => {
        const response = await api.post('/v1/freelancer-skills', {
            freelancerId,
            skillId
        });
        return {
            message: response.statusText,
            status: response.status,
            data: response.data,
        };
    },

    removeSkillFromFreelancer: async (freelancerId: number, skillId: number): Promise<ApiResponse<null>> => {
        const response = await api.delete(`/v1/freelancer-skills/${freelancerId}/${skillId}`);
        return {
            message: response.statusText,
            status: response.status,
            data: response.data,
        };
    },

    createSkill: async (skillName: string): Promise<ApiResponse<Skill>> => {
        const response = await api.post('/v1/jobs/skills', {
            skillName
        });
        return {
            message: response.statusText,
            status: response.status,
            data: response.data,
        };
    }
};

export default skillService;
export type { Skill, FreelancerSkill, ApiResponse };