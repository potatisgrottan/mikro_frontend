// src/api.js
import axios from "axios";

const AUTH_URL = "http://localhost:8081/api/auth";
const JOURNAL_URL = "http://localhost:8082/api";
const MESSAGE_URL = "http://localhost:8083/api/messages";
const IMAGE_URL = "http://localhost:3001";
/*
url för k8
VITE_AUTH_URL=http://auth-service:8080/api/auth
VITE_JOURNAL_URL=http://journal-service:8080/api
VITE_MESSAGE_URL=http://message-service:8080/api/messages
VITE_IMAGE_URL=http://image-service:3001
*/

function createClient(baseURL) {
    const client = axios.create({ baseURL });

    client.interceptors.request.use((config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Basic ${token}`;
        }
        return config;
    });

    return client;
}

export const authApi = createClient(AUTH_URL);
export const journalApi = createClient(JOURNAL_URL);
export const messageApi = createClient(MESSAGE_URL);
export const imageApi = createClient(IMAGE_URL);