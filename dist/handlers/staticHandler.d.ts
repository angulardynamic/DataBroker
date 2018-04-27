import { Injector } from '@angular/core';
import { DataBrokerService, DataSource } from '../';
import { IHandler } from './ihandler';
export interface StaticConfig {
    data: any;
}
export declare class StaticHandler extends IHandler {
    private injector;
    private dataBroker;
    constructor(injector: Injector, dataBroker: DataBrokerService);
    handle(dataSource: DataSource): void;
}
