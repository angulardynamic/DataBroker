import { Injector } from '@angular/core';
import { DataBrokerService } from '../databroker.service';
import { DataSource } from '../dataSource';
import { IHandler } from './ihandler';
export interface HttpGetConfig {
    url: string;
    refreshTimeMs: number;
    responseType: HttpResponseType;
}
export declare enum HttpResponseType {
    arraybuffer,
    blob,
    json,
    text,
}
export declare class HttpGetHandler extends IHandler {
    private injector;
    private dataBroker;
    private http;
    private template;
    constructor(injector: Injector, dataBroker: DataBrokerService);
    handle(dataSource: DataSource): void;
    private handleError(error);
}
