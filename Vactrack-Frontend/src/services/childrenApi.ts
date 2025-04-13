
import axios from 'axios';
import { ChildProfile } from '@/types/children';

const API_URL = 'http://localhost:8080';

// Configure axios with interceptor to add token
const axiosClient = axios.create({
  baseURL: API_URL
});

// Add token to each request
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API calls
export const childrenApi = {
  // Get all children
  getAll: async (): Promise<ChildProfile[]> => {
    try {
      const response = await axiosClient.get('/api/children');
      return response.data;
    } catch (error) {
      console.error('Error fetching children:', error);
      throw error;
    }
  },

  // Get child information by ID
  getById: async (id: string): Promise<ChildProfile> => {
    try {
      const response = await axiosClient.get(`/api/children/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching child ID ${id}:`, error);
      throw error;
    }
  },

  // Add new child
  create: async (childData: Omit<ChildProfile, "id">): Promise<ChildProfile> => {
    try {
      const response = await axiosClient.post('/api/children', childData);
      return response.data;
    } catch (error) {
      console.error('Error adding new child:', error);
      throw error;
    }
  },

  // Update child information
  update: async (id: string, childData: Partial<ChildProfile>): Promise<ChildProfile> => {
    try {
      const response = await axiosClient.put(`/api/children/${id}`, childData);
      return response.data;
    } catch (error) {
      console.error(`Error updating child ID ${id}:`, error);
      throw error;
    }
  },

  // Delete child
  delete: async (id: string): Promise<boolean> => {
    try {
      await axiosClient.delete(`/api/children/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting child ID ${id}:`, error);
      throw error;
    }
  }
};
