import { Injector } from '@angular/core';
import { DataBrokerService } from '../databroker.service';
import { DataSource } from '../dataSource';
import { IHandler } from './ihandler';
export interface HttpPostConfig {
    url: string;
    result: string;
    error: string;
}
export declare class HttpPostHandler extends IHandler {
    private injector;
    private dataBroker;
    private http;
    private template;
    constructor(injector: Injector, dataBroker: DataBrokerService);
    handle(dataSource: DataSource): void;
    private handleError(error);
}
