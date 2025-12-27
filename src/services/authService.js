import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

// Auth Service for JWT token management
const authService = {
    // Register new user
    register: async (name, email, password, role = 'reader') => {
        try {
            const response = await axios.post(`${API_URL}/register`, {
                name,
                email,
                password,
                role
            });

            if (response.data.success) {
                // Store token and user data in localStorage
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message
            };
        }
    },

    // Login existing user
    login: async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/login`, {
                email,
                password
            });

            console.log('AuthService - Full response:', response.data);

            if (response.data.success) {
                console.log('AuthService - Storing token:', response.data.token);
                console.log('AuthService - Storing user:', response.data.user);

                // Store token and user data in localStorage
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));

                console.log('AuthService - Token stored:', localStorage.getItem('token'));
                console.log('AuthService - User stored:', localStorage.getItem('user'));
            }

            return response.data;
        } catch (error) {
            console.error('AuthService - Login error:', error);
            return {
                success: false,
                message: error.response?.data?.message || error.message
            };
        }
    },

    // Logout user
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Get token from localStorage
    getToken: () => {
        return localStorage.getItem('token');
    },

    // Get user data from localStorage
    getUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        return !!token;
    },

    // Get Authorization header
    getAuthHeader: () => {
        const token = authService.getToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
    }
};

export default authService;
