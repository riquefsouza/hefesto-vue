import { AxiosRequestConfig } from "axios";

const KEY = 'authToken';

export class TokenService {

    hasToken() {
        return !!this.getToken();
    }

    setToken(token: string) {
        window.localStorage.setItem(KEY, token);
    }

    getToken() {
        return window.localStorage.getItem(KEY);
    }

    removeToken() {
        window.localStorage.removeItem(KEY);
    }

    getAuth(): AxiosRequestConfig {
        return { headers: {'Authorization': this.getToken() }};
    }

    getAuthWithBlob(): AxiosRequestConfig {
        return { 
            headers: {'Authorization': this.getToken()},
            responseType: 'blob' 
        };
    }
}