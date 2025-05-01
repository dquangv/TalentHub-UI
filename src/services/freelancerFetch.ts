import api from "@/api/axiosConfig";

export const fetchFreelancers = async () => {
  try {
    const response = await api.get('/v1/freelancers/info');
    return response; 
  } catch (error) {
    console.error('Error fetching freelancers data:', error);
    throw error; 
  }
};
