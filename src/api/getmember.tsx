import axios from 'axios';

export const getInfos = (id: number) => {
    const API_URL = import.meta.env.VITE_KEY;
    return axios.get(`${API_URL}/members/${id}`).then((response) => response.data.data);
};
