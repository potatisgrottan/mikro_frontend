import axios from "axios";
import { User } from "oidc-client-ts";

const AUTH_URL = "https://auth-servicea.app.cloud.cbh.kth.se/api/auth";
const JOURNAL_URL = "https://journal-servicea.app.cloud.cbh.kth.se/api";
const MESSAGE_URL = "https://message-servicea.app.cloud.cbh.kth.se/api/messages";
const SEARCH_URL = "https://search-servicea.app.cloud.cbh.kth.se/api/search";
const IMAGE_URL = "https://image-servicea.app.cloud.cbh.kth.se";

function getAccessToken() {
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith("oidc.user:")) {
            const userString = sessionStorage.getItem(key);
            if (userString) {
                const user = User.fromStorageString(userString);
                return user?.access_token;
            }
        }
    }
    return null;
}

function createClient(baseURL) {
    const client = axios.create({ baseURL });

    client.interceptors.request.use((config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    return client;
}

export const authApi = createClient(AUTH_URL);
export const journalApi = createClient(JOURNAL_URL);
export const messageApi = createClient(MESSAGE_URL);
export const searchApi = createClient(SEARCH_URL);
export const imageApi = createClient(IMAGE_URL);