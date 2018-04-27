import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { DataSource, DefaultType } from 'dataSource';
import { DataBrokerService } from 'databroker.service';
import { Template } from 'template.service';
import { StaticHandler, StaticConfig } from 'handlers/staticHandler';

const dataSources: DataSource[] = [
    {
        id: 'test',
        dataSourceType: 'Static',
        defaultType: DefaultType.object,
        config: <StaticConfig>{
            data: {
                DUB: { name: 'Dublin' },
                WRO: { name: 'Wroclaw' },
                MAD: { name: 'Madrid' }
            }
        }
    }
];

describe('Service: StaticHandler', () => {
    let dataBrokerService: DataBrokerService;
    let injector: Injector;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                Injector,
                DataBrokerService,
                Template
            ]
        });
        injector = TestBed.get(Injector);
        dataBrokerService = TestBed.get(DataBrokerService);

        dataBrokerService.registerHandler('Static', new StaticHandler(injector, dataBrokerService));
        dataBrokerService.setDataSources(dataSources);
    });

    it('#handle: should send output to dataBroker.service and be received on subscribeData', () => {
        let data = (<StaticConfig>dataSources[0].config).data;

        dataBrokerService.subscribeData('test').subscribe(airports => {
            expect(typeof airports === 'object', true);
            expect(Object.keys(airports).length).toBe(3);
            expect(Object.keys(airports)[2]).toBe('MAD');
        });
    });
});
