import axios from 'axios';
import authService from './authService';

const API_URL = `${import.meta.env.VITE_API_URL}/api/user`;

// Get auth config with headers
const getAuthConfig = () => {
    const headers = {
        ...authService.getAuthHeader()
    };
    return { headers, withCredentials: true };
};

// Update user profile
export const updateProfile = async (userData) => {
    try {
        const response = await axios.put(`${API_URL}/profile`, userData, getAuthConfig());

        // Update localStorage if profile update was successful
        if (response.data.success && response.data.user) {
            const currentUser = authService.getUser();
            const updatedUser = { ...currentUser, ...response.data.user };
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }

        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get user profile
export const getProfile = async () => {
    try {
        const response = await axios.get(`${API_URL}/data`, getAuthConfig());
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Delete user account
export const deleteAccount = async () => {
    try {
        const response = await axios.delete(`${API_URL}/account`, getAuthConfig());

        // Clear localStorage if deletion was successful
        if (response.data.success) {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
            localStorage.removeItem('userRole');
        }

        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export default {
    updateProfile,
    getProfile,
    deleteAccount
};
