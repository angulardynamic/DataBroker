import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { DataBrokerService } from './databroker.service';
import { Template } from './template.service';

import { RequestCache, RequestCacheWithMap } from './request-cache.service';
import { httpInterceptorProviders } from './http-interceptors/index';

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
    Template,
    { provide: RequestCache, useClass: RequestCacheWithMap },
    httpInterceptorProviders,
]
})
export class DataBrokerModule {
    static forRoot(): ModuleWithProviders {
        return {
          ngModule: DataBrokerModule,
          providers: [DataBrokerService]
        };
      }
}
