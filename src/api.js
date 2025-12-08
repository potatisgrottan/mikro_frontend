// src/api.js
import axios from "axios";

const AUTH_URL = "https://auth-servicea.app.cloud.cbh.kth.se/api/auth";

const JOURNAL_URL = "https://journal-servicea.app.cloud.cbh.kth.se/api";

const MESSAGE_URL = "https://message-servicea.app.cloud.cbh.kth.se/api/messages";

const IMAGE_URL = "https://image-servicea.app.cloud.cbh.kth.se";

const SEARCH_URL = "https://search-servicea.app.cloud.cbh.kth.se/api/search";
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
export const searchApi = createClient(SEARCH_URL);