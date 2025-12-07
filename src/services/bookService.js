import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:4000/api/books';

// Get auth config with headers
const getAuthConfig = () => {
    const headers = {
        ...authService.getAuthHeader()
    };
    return { headers, withCredentials: true };
};

// Upload a new book
export const uploadBook = async (bookData) => {
    try {
        const formData = new FormData();

        // Append all text fields
        Object.keys(bookData).forEach(key => {
            if (key !== 'bookFile' && key !== 'coverImage' && bookData[key]) {
                formData.append(key, bookData[key]);
            }
        });

        // Append files
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

// Get books by writer ID
export const getWriterBooks = async (writerId) => {
    try {
        const response = await axios.get(`${API_URL}/writer/${writerId}`, getAuthConfig());
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get all books
export const getAllBooks = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Update a book
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

// Delete a book
export const deleteBook = async (bookId) => {
    try {
        const response = await axios.delete(`${API_URL}/${bookId}`, getAuthConfig());
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get single book
export const getBook = async (bookId) => {
    try {
        const response = await axios.get(`${API_URL}/${bookId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
