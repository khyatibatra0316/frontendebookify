import axios from 'axios';
import authService from './authService';

const API_URL = `${import.meta.env.VITE_API_URL}/api/books`;
export const BASE_URL = import.meta.env.VITE_API_URL;


const getAuthConfig = () => {
    const headers = {
        ...authService.getAuthHeader()
    };
    return { headers, withCredentials: true };
};

export const uploadBook = async (bookData) => {
    try {
        const formData = new FormData();

   
        Object.keys(bookData).forEach(key => {
            if (key !== 'bookFile' && key !== 'coverImage' && bookData[key]) {
                formData.append(key, bookData[key]);
            }
        });

   
        if (bookData.bookFile) {
            formData.append('bookFile', bookData.bookFile);
        }
        if (bookData.coverImage) {
            formData.append('coverImage', bookData.coverImage);
        }

        const config = getAuthConfig();
        config.headers['Content-Type'] = 'multipart/form-data';

        const response = await axios.post(API_URL, formData, config);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};


export const getWriterBooks = async (writerId) => {
    try {
        const response = await axios.get(`${API_URL}/writer/${writerId}`, getAuthConfig());
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getAllBooks = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};


export const updateBook = async (bookId, bookData) => {
    try {
        const formData = new FormData();

        Object.keys(bookData).forEach(key => {
            if (bookData[key] !== null && bookData[key] !== undefined) {
                formData.append(key, bookData[key]);
            }
        });

        const config = getAuthConfig();
        config.headers['Content-Type'] = 'multipart/form-data';

        const response = await axios.put(`${API_URL}/${bookId}`, formData, config);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};


export const deleteBook = async (bookId) => {
    try {
        const response = await axios.delete(`${API_URL}/${bookId}`, getAuthConfig());
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};


export const getBook = async (bookId) => {
    try {
        const response = await axios.get(`${API_URL}/${bookId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
