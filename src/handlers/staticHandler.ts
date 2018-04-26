import { Injector } from '@angular/core';
import { DataBrokerService, DataSource } from '../';
import { IHandler } from './ihandler';

export interface StaticConfig {
    data: any;
}

export class StaticHandler extends IHandler {
    constructor(
        private injector: Injector,
        private dataBroker: DataBrokerService
    ) {
        super();
    }

    handle(dataSource: DataSource): void {
        // console.debug(`DataBrokerService:sendStaticData("${dataSource.id}")`);
        // let dataSource = this.dataBroker.getDataSource(serviceId);
        let config: StaticConfig;

        if (!dataSource.hasOwnProperty('config')) {
            return;
        }

        config = <StaticConfig>dataSource.config;

        this.dataBroker.publishData(dataSource.id, config.data);
    }
}
