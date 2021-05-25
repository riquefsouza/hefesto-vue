import { TokenService } from '@/base/services/TokenService';
import { BehaviorSubject } from 'rxjs';
import { emptyUser, User } from './user';
// eslint-disable-next-line @typescript-eslint/camelcase
import jtw_decode from 'jwt-decode';
import axios from 'axios';

export default class UserService {

    private userSubject = new BehaviorSubject<User>(emptyUser);
    private userName = "";
    private tokenService: TokenService;

    constructor() {
        this.tokenService = new TokenService();
        this.tokenService.hasToken() && this.decodeAndNotify();
    }

    setToken(token: string) {
        this.tokenService.setToken(token);
        this.decodeAndNotify();
    }

    getUser() {
        return this.userSubject.asObservable();
    }

    private decodeAndNotify() {
        const token = this.tokenService.getToken();
        if (token){
            const user = jtw_decode(token) as User;
            this.userName = user.name;
            this.userSubject.next(user);    
        }
    }

    logout() {
        this.tokenService.removeToken();
        axios.defaults.headers.common['Authorization'] = '';
        this.userSubject.next(emptyUser);
    }

    isLogged() {
        return this.tokenService.hasToken();
    }

    getUserName() {
        return this.userName;
    }
}