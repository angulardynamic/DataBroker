import { Injector } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Template, DataBrokerService, DataSource } from '../';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { IHandler } from './ihandler';
import { catchError } from 'rxjs/operators/catchError';

export interface HttpGetConfig {
    url: string;
    refreshTimeMs: number;
    responseType: HttpResponseType;
}

// TODO: <any> is hacky
// https://github.com/dherges/ng-packagr/issues/206
export enum HttpResponseType {
    arraybuffer = <any>'arraybuffer',
    blob = <any>'blob',
    json = <any>'json',
    text = <any>'text'
}

export class HttpGetHandler extends IHandler {
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

    handle(dataSource: DataSource): void { // Observable<any>
        // TODO: check for fullyQualifiedDomain
        // if (fullyQualifiedDomain)

        // serviceId: string

        // if (this.dataBroker.hasDataSource(serviceId)) {
        // let dataSource = this.dataBroker.getDataSource(serviceId);

        let config: HttpGetConfig;

        if (!dataSource.hasOwnProperty('config')) {
            return;
        }

        config = <HttpGetConfig>dataSource.config;

        if (!config.hasOwnProperty('url')) {
            console.error('<HttpGet>DataSource.config missing \'url\'');
            return;
        }

        let serviceUrlTmpl: string = config.url;

        if (serviceUrlTmpl !== null) {
            let dObject = {};
            let ctx = this.dataBroker.getDataPublisher('context');

            // if (ctx)
            // {
            //     ctx.subscribe((context) => {
            //         console.log("DataBrokerService:Received:context:", context);

            //         this.cachedData["context"] = context;
            //     });
            // }
            // data["context"] = await ctx.first().toPromise();
            if (ctx) {
                dObject['context'] = ctx.value;
            }

            // console.debug('DataBrokerService:data["context"]: ', dObject["context"]);

            let matches = [];
            let serviceUrl = this.template.parseTpl(serviceUrlTmpl, dObject, matches);

            // if (matches.length > 0)
            // {
            //     matches.forEach(match => {
            //         if (!this.dependencies.has(match)) {
            //             this.dependencies.set(match, []);
            //         }

            //         this.dependencies.get(match).push(serviceId);
            //     });
            // }

            // console.log(" Databroker:dependencies:", this.dependencies);

            let responseType = 'json';

            // console.log("serviceUrl", serviceUrl);
            // TODO: This probably won't work...
            this.http.get(serviceUrl, { responseType: responseType as 'text' })
                .pipe(
                    catchError(this.handleError)
                )
                .subscribe(
                    (data) => {
                        let sId = dataSource.id;
                        // console.debug(" refreshData Received from:", sId, "data:", data);

                        this.dataBroker.publishData(sId, data);
                    },
                    (error) => {

                    }
                );
        }
        // }
        // else
        // {
        //     console.error(` refreshData:serviceId: "${serviceId}" not found.`);
        // }

        // return this.data.get(service);
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

    // private handleError(error: any) {
    //     // In a real world app, we might use a remote logging infrastructure
    //     // We'd also dig deeper into the error to get a better message
    //     let errorMessage = (error.message) ? error.message :
    //         error.status ? `${error.status} - ${error.statusText}` : 'Server error';

    //     console.log("ERROR", error);
    //     console.error(errorMessage); // log to console instead

    //     return Observable.throw(errorMessage);
    // }
}
