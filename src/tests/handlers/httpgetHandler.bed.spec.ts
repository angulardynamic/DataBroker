import 'rxjs/add/operator/first';

import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { HttpGetHandler, HttpGetConfig } from '../../handlers/httpgetHandler';
import { DataSource, DefaultType } from 'dataSource';
import { DataBrokerService } from '../..';
import { Template } from 'template.service';

const mockAirports = {
    DUB: { name: 'Dublin' },
    WRO: { name: 'Wroclaw' },
    MAD: { name: 'Madrid' }
};

const dataSources: DataSource[] = [
    {
        id: 'test',
        dataSourceType: 'HttpGet',
        defaultType: DefaultType.object,
        config: <HttpGetConfig>{
            url: 'https://foo.bar.com/airports'
        }
    }
];

describe('Service: HttpGetHandler', () => {
    let httpMock: HttpTestingController;
    let dataBrokerService: DataBrokerService;
    let injector: Injector;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                Injector,
                DataBrokerService,
                Template
            ]
        });
        httpMock = TestBed.get(HttpTestingController);
        injector = TestBed.get(Injector);
        dataBrokerService = TestBed.get(DataBrokerService);

        dataBrokerService.registerHandler('HttpGet', new HttpGetHandler(injector, dataBrokerService));
        dataBrokerService.setDataSources(dataSources);
    });

    it('#handle: should send output to dataBroker.service and be received on subscribeData', () => {
        let url = (<HttpGetConfig>dataSources[0].config).url;
        let firstSub = dataBrokerService.subscribeData('test').first().subscribe(airports => {
            expect(typeof airports === 'object', true);
            expect(Object.keys(airports).length).toBe(0);
        });

        const req = httpMock.expectOne(url);

        req.flush(mockAirports);

        dataBrokerService.subscribeData('test').subscribe(airports => {
            expect(typeof airports === 'object', true);
            expect(Object.keys(airports).length).toBe(3);
            expect(Object.keys(airports)[2]).toBe('MAD');
        });

        httpMock.verify();
    });
});
