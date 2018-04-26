import { HttpRequest, HttpResponse } from '@angular/common/http';
export interface RequestCacheEntry {
    url: string;
    response: HttpResponse<any>;
    lastRead: number;
}
export declare abstract class RequestCache {
    abstract get(req: HttpRequest<any>): HttpResponse<any> | undefined;
    abstract put(req: HttpRequest<any>, response: HttpResponse<any>): void;
}
export declare class RequestCacheWithMap implements RequestCache {
    cache: Map<string, RequestCacheEntry>;
    constructor();
    get(req: HttpRequest<any>): HttpResponse<any> | undefined;
    put(req: HttpRequest<any>, response: HttpResponse<any>): void;
}
