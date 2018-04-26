import { Injectable, Injector } from '@angular/core';
import { isEmpty } from 'lodash';
import { Observable } from 'rxjs/Observable';
// import { Subscription } from 'rxjs/Subscription';
// import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
// import { catchError, retry } from 'rxjs/operators';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { DataSource } from './dataSource';
import { IHandler } from 'handlers/ihandler';

@Injectable()
export class DataBrokerService {
    private dataSources: Map<string, DataSource> = new Map<string, DataSource>();
    private dataPublishers: Map<string, BehaviorSubject<any>> = new Map<string, BehaviorSubject<any>>();

    // private cachedData: Map<string, any> = new Map<string, any>();
    // private dependencies: Map<string, any[]> = new Map<string, any[]>();
    // private subscribers: Map<string, Subscription> = new Map<string, Subscription>();
    private handlers: Map<string, IHandler> = new Map<string, IHandler>();

    constructor(
        private injector: Injector
    ) {
    }

    // getData(): Promise<any> {
    //     return new Promise((resolve, reject) => {
    //         setTimeout(() => {
    //             resolve(this.smartTableData);
    //         }, 2000);
    //     });
    // }

    getDataPublisher(serviceId: string) {
        return this.dataPublishers.get(serviceId);
    }

    getAllDataPublisher() {
        return this.dataPublishers;
    }

    hasDataSource(serviceId: string) {
        return this.dataSources.has(serviceId);
    }

    getDataSource(serviceId: string): DataSource {
        return this.dataSources.get(serviceId);
    }

    setDataSources(dataSources: DataSource[]): void {
        this.dataSources.clear();

        dataSources.forEach(dataSource => {
            this.setDataSource(dataSource);
        });
    }

    setDataSource(dataSource: DataSource): void {
        // console.log("setDataSource", dataSource);
        // console.log(` this.dataSources.get(${dataSource.id})`, this.dataSources.get(dataSource.id));

        if (dataSource === undefined || isEmpty(dataSource)) {
            console.error(' dataSource is undefined or empty');
            return;
        } else {
            // console.debug(`   dataSource:${dataSource.DataSourceId}, ${dataSource.name}`);
        }

        this.dataSources.set(dataSource.id, dataSource);
        // console.log(` this.dataSources.get(${dataSource.id})`, this.dataSources.get(dataSource.id));

        // let dataSource = this.dataSources.get(service);
        let defaultType = (dataSource.hasOwnProperty('defaultType') ? dataSource.defaultType.toString() : 'object');

        let defaultData = this.getEmptyDefaultByDataType(defaultType);

        this.addDataPublisher(dataSource.id, defaultData);
        // console.log(` dataSourceId: "${dataSource.id}`);

        // if (dataSource.dataSourceType == DataSourceType.HttpGet) {
        //     this.refreshData(dataSource.id);
        // }
        // else if (dataSource.dataSourceType == DataSourceType.Static) {
        //     this.sendStaticData(dataSource.id);
        // }
        // else if (dataSource.dataSourceType == DataSourceType.Websockets) {
        //     this.addWebSocket(dataSource);
        // }
        // else if (dataSource.dataSourceType == DataSourceType.Subscriber) {
        //     this.addTransform(dataSource);
        // }

        this.handle(dataSource);
    }

    handle(dataSource: DataSource) {
        if (this.handlers.has(dataSource.dataSourceType)) {
            let handler = this.handlers.get(dataSource.dataSourceType);
            handler.handle(dataSource);
        } else {
            console.log("No Handler matched.");
        }
    }

    registerHandler(dataSourceType: string, hander: IHandler) {
        this.handlers.set(dataSourceType, hander);
    }

    getEmptyDefaultByDataType(defaultType: string): Array<any> | string | object {
        defaultType = defaultType.toLowerCase();

        return (defaultType === 'array' ? []
            : defaultType === 'string' ? ''
                : defaultType === 'number' ? null
                    : {}
        );
    }

    addDataPublisher(subject: string, defaultData: any): void {
        // console.debug(`DataBrokerService.addDataMap("${subject}"`, defaultData, ")");
        this.dataPublishers.set(subject, new BehaviorSubject<any>(defaultData));

        // console.log(` Added service: ${service} is Observable: `, this.data.get(service) instanceof Observable);
        // this.refreshData(service);
    }

    initPublisher(subject: string, data: any = {}): boolean {
        if (!this.dataPublishers.has(subject)) {
            // console.debug(`initData.subject(subject: "${subject}", data:`, data);
            this.dataPublishers.set(subject, new BehaviorSubject<any>(data));

            return true;
        } else {
            // console.debug("initData:alreadyExists");
            return false;
        }
    }

    getData(subject: string, defaultData = {}): Observable<any> {
        // console.log(`DataBrokerService:getData("${subject}", ...)`);
        if (!this.dataPublishers.has(subject)) {
            this.addDataPublisher(subject, defaultData);
        }

        // console.debug(`DataBrokerService.getData("${subject}"):service:`, this.dataPublishers.get(subject).asObservable().toArray());

        return this.dataPublishers.get(subject);
    }

    subscribeData(subject: string): Observable<any> {
        // console.log(`DataBrokerService.subscribeData(subject:"${subject}"`);
        this.initPublisher(subject);

        return this.dataPublishers.get(subject);
    }

    publishData(subject: string, data: any): void {
        // console.log(`DataBrokerService.publishData(subject: "${subject}", data:`, data);
        if (!this.initPublisher(subject, data)) {
            this.dataPublishers.get(subject).next(data);

            // console.debug(` Sent to: "${subject}"`); //, publisher: `, publisher);
        }
    }

}
