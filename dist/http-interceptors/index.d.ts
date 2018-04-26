import { InjectionToken } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { CachingInterceptor } from './caching-interceptor';
/** Http interceptor providers in outside-in order */
export declare const httpInterceptorProviders: {
    provide: InjectionToken<HttpInterceptor[]>;
    useClass: typeof CachingInterceptor;
    multi: boolean;
}[];
