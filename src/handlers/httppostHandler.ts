import { Injector } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Template } from '../template.service';
import { DataBrokerService } from '../databroker.service';
import { DataSource } from '../dataSource';
import { IHandler } from './ihandler';

export interface HttpPostConfig {
    url: string;
    result: string;
    error: string;
}

export class HttpPostHandler extends IHandler {
    private http: HttpClient;
    private template: Template;

    constructor(
        private injector: Injector,
        private dataBroker: DataBrokerService
    ) {
        super();

        this.http = injector.get(HttpClient);
        this.template = injector.get(Template);
    }

    handle(dataSource: DataSource): void {
        // if (this.dataBroker.hasDataSource(serviceId)) {
        // let dataSource = this.dataBroker.getDataSource(serviceId);

        // this.dataSources.get(serviceId).id;
        let dataSourceConfig = <HttpPostConfig>dataSource.config;

        let dataSubscriber = this.dataBroker.subscribeData(dataSource.id)
            .subscribe((body) => {
                let config = dataSourceConfig;

                let serviceUrl: string = config.url;
                let httpOptions = {};

                this.http.post(serviceUrl, body, httpOptions)
                    // .pipe(
                    //     catchError(this.handleError('addHero', body))
                    // )
                    .subscribe((data) => {
                        if (config.result) {
                            let result = config.result;
                            this.dataBroker.publishData(result, data);
                        }
                    });
            });
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }

        // return an ErrorObservable with a user-facing error message
        return new ErrorObservable(
            'Something bad happened; please try again later.');
    };
}
