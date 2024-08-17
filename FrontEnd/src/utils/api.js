import axios from "axios";

export const backendApi = axios.create({
    baseURL: 'http://localhost:5289/', // Backend API için temel URL
});

// db.json için axios instance
export const jsonApi = axios.create({
    baseURL: 'http://localhost:4005/', // db.json için temel URL
});
