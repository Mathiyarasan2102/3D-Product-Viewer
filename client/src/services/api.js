import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const uploadModelAPI = async (file) => {
    const formData = new FormData();
    formData.append('model', file);
    const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const saveSettingsAPI = async (settings) => {
    const response = await axios.post(`${API_URL}/settings`, settings);
    return response.data;
};

export const getSettingsAPI = async () => {
    const response = await axios.get(`${API_URL}/settings`);
    return response.data;
};
