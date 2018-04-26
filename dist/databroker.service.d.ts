import { Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataSource } from './dataSource';
import { IHandler } from 'handlers/ihandler';
export declare class DataBrokerService {
    private injector;
    private dataSources;
    private dataPublishers;
    private handlers;
    constructor(injector: Injector);
    getDataPublisher(serviceId: string): BehaviorSubject<any>;
    getAllDataPublisher(): Map<string, BehaviorSubject<any>>;
    hasDataSource(serviceId: string): boolean;
    getDataSource(serviceId: string): DataSource;
    setDataSources(dataSources: DataSource[]): void;
    setDataSource(dataSource: DataSource): void;
    handle(dataSource: DataSource): void;
    registerHandler(dataSourceType: string, hander: IHandler): void;
    getEmptyDefaultByDataType(defaultType: string): Array<any> | string | object;
    addDataPublisher(subject: string, defaultData: any): void;
    initPublisher(subject: string, data?: any): boolean;
    getData(subject: string, defaultData?: {}): Observable<any>;
    subscribeData(subject: string): Observable<any>;
    publishData(subject: string, data: any): void;
}
