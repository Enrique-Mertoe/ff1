import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from "@angular/router";
import {NotificationService} from "./notification.service";
import {AuthService} from "./auth.service";
import {lastValueFrom} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    authService: AuthService;

    constructor(
        public httpClient: HttpClient,
        private router: Router,
        private notificationService: NotificationService
    ) {
    }

    async request<T>(apiURL: string, method: string, action: string, body?: any): Promise<T | undefined> {
        // Add console logs for water source related API calls
        const fullUrl = apiURL + action;
        // const params: any = {'Access-Control-Allow-Origin': environment.origin};
        const params: any = {};
        if (body && method === 'GET') {
            for (const key in body) {
                if (body.hasOwnProperty(key)) {
                    params[key] = body[key];
                }
            }
        }
        try {
            return await lastValueFrom(this.httpClient.request<T>(method, apiURL + action, {params, body}));
        } catch (error) {
            console.log('REQUEST.ERROR', error);
            if (error.status === 401 && action !== '/auth/sign-in') {
                this.notificationService.error('Error', error.error.message);
                this.authService.logout();
                return undefined;
            }
            if (error.error && error.error.message) {
                if ((typeof error.error.message) === 'object') {
                    this.notificationService.error('Error', error.error.message.message);
                } else {
                    this.notificationService.error('Error', error.error.message);
                }
            } else if (error.statusText) {
                this.notificationService.error('Error', error.statusText + ', Check your internet connection.');
            }
            throw error;
        }
    }

    api<T>(method: string, action: string, body?) {
        return this.request<T>(environment.apiURL, method, action, body);
    }

    get<T>(apiUrl: string, body?: any) {
        return this.request<T>(environment.apiURL, "GET", apiUrl, body);
    }
    post<T>(apiUrl: string, body?: any) {
        return this.request<T>(environment.apiURL, "POST", apiUrl, body);
    }
    
    async postFormData<T>(apiUrl: string, formData: FormData): Promise<T | undefined> {
        try {
            return await lastValueFrom(this.httpClient.post<T>(environment.apiURL + apiUrl, formData));
        } catch (error) {
            console.log('FORM_DATA_REQUEST.ERROR', error);
            if (error.status === 401) {
                this.notificationService.error('Error', error.error.message);
                this.authService.logout();
                return undefined;
            }
            if (error.error && error.error.message) {
                if ((typeof error.error.message) === 'object') {
                    this.notificationService.error('Error', error.error.message.message);
                } else {
                    this.notificationService.error('Error', error.error.message);
                }
            } else if (error.statusText) {
                this.notificationService.error('Error', error.statusText + ', Check your internet connection.');
            }
            throw error;
        }
    }
}
