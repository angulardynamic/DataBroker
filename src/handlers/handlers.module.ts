import { NgModule, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { DataBrokerService } from '../databroker.service';
import { Template } from '../template.service';

// import { DataSourceType } from 'dataSource';
import { HttpGetHandler } from './httpgetHandler';
import { HttpPost } from './httppostHandler';
import { Transform } from './transformHandler';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
    ],
    exports: [
    ],
    declarations: [
    ],
    providers: [
        DataBrokerService,
        Template
    ]
})
export class HandlersModule {
    constructor(private injector: Injector, dataBrokerService: DataBrokerService) {
        dataBrokerService.registerHandler('HttpGet', new HttpGetHandler(injector, dataBrokerService));
        dataBrokerService.registerHandler('HttpPost', new HttpPost(injector, dataBrokerService));
        dataBrokerService.registerHandler('Subscriber', new Transform(injector, dataBrokerService));
    }
}
