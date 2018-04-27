import { Injector } from '@angular/core';
import { DataBrokerService } from '../databroker.service';
import { DataSource } from '../dataSource';
import { clone, isEmpty } from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Query } from '../filter/query';
import { FilterService } from '../filter/filter.service';
import { IHandler } from './ihandler';
import { Subscription } from 'rxjs';

export interface SubscriberConfig {
    trigger: string;
    source: string;

    transforms: Transform[];
}

export interface Transform {
    type: TransformType;
    config?: TransformFilter | TransformCrossfilter;
}

// TODO: <any> is hacky
// https://github.com/dherges/ng-packagr/issues/206
export enum TransformType {
    filter = <any>'filter',
    crossfilter = <any>'crossfilter',
    map = <any>'map'
}

export interface TransformFilter {
    filterType: 'local' | 'remote';
    source: string;
    variableName: string;
    query: Query[];
}

export interface TransformCrossfilter {

}


export class Transform extends IHandler {
    private filterService: FilterService;
    private filterSources: Map<string, string[]> = new Map<string, string[]>();
    private filters: Subscription[] = new Array<Subscription>();

    constructor(
        private injector: Injector,
        private dataBroker: DataBrokerService,
    ) {
        super();

        this.filterService = new FilterService();
    }

    handle(dataSource: DataSource) {
        let config = <SubscriberConfig>dataSource.config;

        if (config.trigger !== '') {
            let trigger = this.dataBroker.subscribeData(config.trigger);

            let triggerSub = trigger
                // .debounceTime(time)
                .subscribe(triggerData => {
                    let dataBroker = this.dataBroker;
                    let ds = dataSource;
                    let c = <SubscriberConfig>ds.config;

                    let sourceData = {};
                    if (c.source) {
                        sourceData = clone(dataBroker.getDataPublisher(c.source).value);
                    }

                    this.transformAndPublish(ds.id, c, sourceData, triggerData);
                });
        }

        if (config.source !== '') {
            let source = this.dataBroker.subscribeData(config.source);

            let time = 100; // Wait 500ms

            let sourceSub = source
                .subscribe(sourceData => {
                    let dataBroker = this.dataBroker;
                    let ds = dataSource;
                    let c = <SubscriberConfig>ds.config;

                    let triggerData = {};
                    if (c.trigger) {
                        triggerData = clone(dataBroker.getDataPublisher(c.trigger).value);
                    }

                    this.transformAndPublish(ds.id, c, sourceData, triggerData);

                    console.log('');
                });
        }
    }

    transformAndPublish(publisherId: string, config: SubscriberConfig, sourceData: any, triggerData: any) {
        let data = {};
        this.dataBroker.getAllDataPublisher().forEach((v, k) => {
            data[k] = v.value;
        });

        let filteredData = this.transform(config, sourceData, triggerData);

        if (sourceData !== filteredData) {
            // console.debug(" publishing data");
            this.dataBroker.publishData(publisherId, filteredData);
            // this.publishData(subscriber + ":filtered", newValue);
        }
    }

    transform(config: SubscriberConfig, value: any, data: any): any {
        // console.log("transform:config", config, "value", value, "data", data);
        let transformedValue = clone(value);

        if (isEmpty(data) && isEmpty(value)) {
            // console.log("     data is empty");

            return transformedValue;
        }

        if (config.hasOwnProperty('transforms')) {
            config.transforms.forEach(transform => {
                // console.log("Transform", transform);
                if (transform.type === TransformType.filter) {
                    let transformConfig = <TransformFilter>transform.config;

                    if (transformConfig.hasOwnProperty('query')) {
                        let query = transformConfig.query;
                        transformedValue = this.filter(query, transformedValue, data);
                    } else {
                        console.log('No Transform query defined');
                    }
                } else if (transform.type === TransformType.map) {
                    if (transformedValue.hasOwnProperty('Code')) {
                        transformedValue = JSON.parse(transformedValue.Code);
                    }
                }
            });
        }
        else {
            console.log('No Transforms defined.');
        }

        return transformedValue;
    }

    filter(query: Query[], sourceData: any, data: any): any {
        if (sourceData === undefined || !sourceData || isEmpty(sourceData)) {
            console.error(' value is undefined or empty.');
            return;
        }

        if (!Array.isArray(sourceData)) {
            console.error(' value is not array.');
            return;
        }

        let filteredData = sourceData.filter(item => {
            let itemMatch = this.filterService.filter(query, item, data);
            return itemMatch;
        });

        return filteredData;
    }

    jsonataFilter() {

    }

    localFilter() {

    }

    crossFilter(subject: string) {

    }

    clearCrossFilter(subject: string) {

    }

    applyDataTransformation(data: object, transform: object): Observable<any> {
        return new Observable();
    }

    // addFilter(publisherId: string, subscriberId: string, defaultData: any = {})
    // {
    //     //console.debug(`DataBrokerService.addFilter(${publisherId}, ${subscriberId}, ...)`);

    //     if (!this.filterSources.get(publisherId))
    //     {
    //         this.filterSources.set(publisherId, new Array<string>());
    //     }

    //     let filterSource = this.filterSources.get(publisherId);

    //     filterSource.push(subscriberId);
    //     //console.debug(` Added dataSource:"${subscriberId}" to filterSources[${publisherId}]`);

    //     //this.addDataPublisher(subscriberId + ":filtered", defaultData);
    //     //console.debug(` subscriberId: ${subscriberId}`);

    //     if (!this.dataPublishers.has(publisherId))
    //     {
    //         this.addDataPublisher(publisherId, {});
    //         //console.debug(` Added data: ${publisherId}`);
    //     }

    //     let dataPublisher = this.dataPublishers.get(publisherId);
    //     //console.debug(" dataPublisher:", dataPublisher);

    //     let subscription = dataPublisher.subscribe(d => {
    //         let dsId = publisherId;
    //         //console.debug(`Filter publisherId: ${dsId}, received update:`, d);
    //         this.runFilterService(dsId, d);
    //     });

    //     //console.debug(` subscriberId: ${subscriberId} subscribed to: ${publisherId}`);

    //     //this.filters.push(subscription);
    // }

    // runFilterService(serviceId: string, triggerData: any)
    // {
    //     //console.debug(`DataBrokerService:filter(serviceId: "${serviceId}, data:`, data);

    //     if (isEmpty(triggerData))
    //     {
    //         //console.log("     data is empty");
    //         return;
    //     }

    //     let dataFilterSubscribers = this.filterSources.get(serviceId);

    //     if (dataFilterSubscribers === undefined || !dataFilterSubscribers)
    //     {
    //         console.error(" dataFilterSubscribers is undefined or empty.");
    //         return;
    //     }

    //     dataFilterSubscribers.forEach(subscriber => {
    //         let dataSource = this.dataSources.get(subscriber);

    //         if (dataSource === undefined || !dataSource)
    //         {
    //             console.error(" dataSource is undefined or empty.");
    //             return;
    //         }

    //         if (dataSource.hasOwnProperty("filter"))
    //         {
    //             let filter = {};//= dataSource.filter;

    //             if (filter.filterType === "local")
    //             {
    //                 //console.debug(" is local filter.");

    //                 let dataPublisher = this.dataPublishers.get(subscriber);
    //                 //console.log(" dataPublisher:", dataPublisher);

    //                 //let value: any = Object.assign([], data.value);
    //                 let sourceData = clone(dataPublisher.value);
    //                 //console.debug(` value:`, value);

    //                 if (sourceData === undefined || !sourceData || isEmpty(sourceData))
    //                 {
    //                     console.error(" value is undefined or empty.");
    //                     return;
    //                 }

    //                 if (!Array.isArray(sourceData))
    //                 {
    //                     console.error(" value is not array.");
    //                     return;
    //                 }

    //                 let query: Query[] = filter.query;

    //                 let newValue = sourceData.filter(item => {
    //                     let itemMatch = this.filterService.filter(query, item, triggerData);
    //                     return itemMatch;
    //                 });

    //                 // Stop propagation if data hasn't changed.
    //                 if (sourceData !== newValue)
    //                 {
    //                     //console.debug(" publishing data");
    //                     this.publishData(subscriber + ":filtered", newValue);
    //                 }
    //                 else
    //                 {
    //                     //console.debug(" value === newValue");
    //                 }
    //             }
    //             else
    //             {
    //                 //console.debug(" dataSource.filter.filtertType = ", dataSource.filter.filterType);
    //             }
    //         }
    //         else
    //         {
    //             //console.debug(` dataSource: ${dataSource.DataSourceId} has no filter property.`);
    //         }
    //     });
    // }
}
