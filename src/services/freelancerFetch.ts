import axiosInstance from '../utils/axiosConfig';

export const fetchFreelancers = async () => {
  try {
    const response = await axiosInstance.get('/freelancers/info');
    return response.data; 
  } catch (error) {
    console.error('Error fetching freelancers data:', error);
    throw error; 
  }
};
