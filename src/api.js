import axios from "axios";
import { User } from "oidc-client-ts";
/*
const AUTH_URL = "https://auth-servicea.app.cloud.cbh.kth.se/api/auth";

const JOURNAL_URL = "https://journal-servicea.app.cloud.cbh.kth.se/api";

const MESSAGE_URL = "https://message-servicea.app.cloud.cbh.kth.se/api/messages";

const IMAGE_URL = "https://image-servicea.app.cloud.cbh.kth.se";

const SEARCH_URL = "https://search-servicea.app.cloud.cbh.kth.se/api/search";
live urlr
*/
// URL:er (samma som förut)
const AUTH_URL = "http://localhost:8081/api/auth"; // Peka på din nya UserProfile Service
const JOURNAL_URL = "http://localhost:8082/api";
const MESSAGE_URL = "http://localhost:8083/api/messages";
const SEARCH_URL = "http://localhost:8084/api/search";
// const IMAGE_URL...

// Hjälpfunktion för att hämta token från OIDC-lagringen
function getAccessToken() {
    const oidcStorage = sessionStorage.getItem(`oidc.user:http://localhost:8080/realms/hospital-realm:hospital-app`);
    if (!oidcStorage) {
        return null;
    }
    return User.fromStorageString(oidcStorage).access_token;
}

function createClient(baseURL) {
    const client = axios.create({ baseURL });

    client.interceptors.request.use((config) => {
        const token = getAccessToken();
        if (token) {
            // BYT TILL BEARER TOKEN
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    return client;
}

export const authApi = createClient(AUTH_URL);
export const journalApi = createClient(JOURNAL_URL);
export const messageApi = createClient(MESSAGE_URL);
export const searchApi = createClient(SEARCH_URL);
export const imageApi = createClient("http://localhost:3001");