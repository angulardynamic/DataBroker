import { Injectable, Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule, HttpHeaders, HttpResponse } from '@angular/common/http';
import { isEmpty } from 'lodash';
import { BehaviorSubject as BehaviorSubject$1 } from 'rxjs/BehaviorSubject';
import { of as of$1 } from 'rxjs/observable/of';
import { startWith, tap } from 'rxjs/operators';
import { ErrorObservable as ErrorObservable$1 } from 'rxjs/observable/ErrorObservable';
import { catchError as catchError$1 } from 'rxjs/operators/catchError';

var DataBrokerService = /** @class */ (function () {
    /**
     * @param {?} injector
     */
    function DataBrokerService(injector) {
        this.injector = injector;
        this.dataSources = new Map();
        this.dataPublishers = new Map();
        this.handlers = new Map();
    }
    /**
     * @param {?} serviceId
     * @return {?}
     */
    DataBrokerService.prototype.getDataPublisher = function (serviceId) {
        return this.dataPublishers.get(serviceId);
    };
    /**
     * @return {?}
     */
    DataBrokerService.prototype.getAllDataPublisher = function () {
        return this.dataPublishers;
    };
    /**
     * @param {?} serviceId
     * @return {?}
     */
    DataBrokerService.prototype.hasDataSource = function (serviceId) {
        return this.dataSources.has(serviceId);
    };
    /**
     * @param {?} serviceId
     * @return {?}
     */
    DataBrokerService.prototype.getDataSource = function (serviceId) {
        return this.dataSources.get(serviceId);
    };
    /**
     * @param {?} dataSources
     * @return {?}
     */
    DataBrokerService.prototype.setDataSources = function (dataSources) {
        var _this = this;
        this.dataSources.clear();
        dataSources.forEach(function (dataSource) {
            _this.setDataSource(dataSource);
        });
    };
    /**
     * @param {?} dataSource
     * @return {?}
     */
    DataBrokerService.prototype.setDataSource = function (dataSource) {
        // console.log("setDataSource", dataSource);
        // console.log(` this.dataSources.get(${dataSource.id})`, this.dataSources.get(dataSource.id));
        if (dataSource === undefined || isEmpty(dataSource)) {
            console.error(' dataSource is undefined or empty');
            return;
        }
        else {
            // console.debug(`   dataSource:${dataSource.DataSourceId}, ${dataSource.name}`);
        }
        this.dataSources.set(dataSource.id, dataSource);
        // console.log(` this.dataSources.get(${dataSource.id})`, this.dataSources.get(dataSource.id));
        // let dataSource = this.dataSources.get(service);
        var /** @type {?} */ defaultType = (dataSource.hasOwnProperty('defaultType') ? dataSource.defaultType.toString() : 'object');
        var /** @type {?} */ defaultData = this.getEmptyDefaultByDataType(defaultType);
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
    };
    /**
     * @param {?} dataSource
     * @return {?}
     */
    DataBrokerService.prototype.handle = function (dataSource) {
        if (this.handlers.has(dataSource.dataSourceType)) {
            var /** @type {?} */ handler = this.handlers.get(dataSource.dataSourceType);
            handler.handle(dataSource);
        }
        else {
            console.log("No Handler matched.");
        }
    };
    /**
     * @param {?} dataSourceType
     * @param {?} hander
     * @return {?}
     */
    DataBrokerService.prototype.registerHandler = function (dataSourceType, hander) {
        this.handlers.set(dataSourceType, hander);
    };
    /**
     * @param {?} defaultType
     * @return {?}
     */
    DataBrokerService.prototype.getEmptyDefaultByDataType = function (defaultType) {
        defaultType = defaultType.toLowerCase();
        return (defaultType === 'array' ? []
            : defaultType === 'string' ? ''
                : defaultType === 'number' ? null
                    : {});
    };
    /**
     * @param {?} subject
     * @param {?} defaultData
     * @return {?}
     */
    DataBrokerService.prototype.addDataPublisher = function (subject, defaultData) {
        // console.debug(`DataBrokerService.addDataMap("${subject}"`, defaultData, ")");
        this.dataPublishers.set(subject, new BehaviorSubject$1(defaultData));
        // console.log(` Added service: ${service} is Observable: `, this.data.get(service) instanceof Observable);
        // this.refreshData(service);
    };
    /**
     * @param {?} subject
     * @param {?=} data
     * @return {?}
     */
    DataBrokerService.prototype.initPublisher = function (subject, data) {
        if (data === void 0) { data = {}; }
        if (!this.dataPublishers.has(subject)) {
            // console.debug(`initData.subject(subject: "${subject}", data:`, data);
            this.dataPublishers.set(subject, new BehaviorSubject$1(data));
            return true;
        }
        else {
            // console.debug("initData:alreadyExists");
            return false;
        }
    };
    /**
     * @param {?} subject
     * @param {?=} defaultData
     * @return {?}
     */
    DataBrokerService.prototype.getData = function (subject, defaultData) {
        if (defaultData === void 0) { defaultData = {}; }
        // console.log(`DataBrokerService:getData("${subject}", ...)`);
        if (!this.dataPublishers.has(subject)) {
            this.addDataPublisher(subject, defaultData);
        }
        // console.debug(`DataBrokerService.getData("${subject}"):service:`, this.dataPublishers.get(subject).asObservable().toArray());
        return this.dataPublishers.get(subject);
    };
    /**
     * @param {?} subject
     * @return {?}
     */
    DataBrokerService.prototype.subscribeData = function (subject) {
        // console.log(`DataBrokerService.subscribeData(subject:"${subject}"`);
        this.initPublisher(subject);
        return this.dataPublishers.get(subject);
    };
    /**
     * @param {?} subject
     * @param {?} data
     * @return {?}
     */
    DataBrokerService.prototype.publishData = function (subject, data) {
        // console.log(`DataBrokerService.publishData(subject: "${subject}", data:`, data);
        if (!this.initPublisher(subject, data)) {
            this.dataPublishers.get(subject).next(data);
            // console.debug(` Sent to: "${subject}"`); //, publisher: `, publisher);
        }
    };
    DataBrokerService.decorators = [
        { type: Injectable },
    ];
    /**
     * @nocollapse
     */
    DataBrokerService.ctorParameters = function () { return [
        { type: Injector, },
    ]; };
    return DataBrokerService;
}());

var Template = /** @class */ (function () {
    function Template() {
        // https://jsperf.com/es6-parse-template-string-rev2
        this.cache = {};
    }
    /**
     * @param {?} template
     * @param {?} bindings
     * @return {?}
     */
    Template.prototype.createParser = function (template, bindings) {
        var /** @type {?} */ sanitized = template
            // Replace ${expressions} (etc) with ${map.expressions}.
            // .replace(/\$\{([\s]*[^;\s\{]+[\s]*)\}/g, // string interpolation style: ${variable}
            // .replace(/\{([\s]*[^;\s\{]+[\s]*)\}/g, //
            .replace(/\{\{([\s]*[^;\s\{]+[\s]*)\}\}/g, // Mustache style: {{variable}}
        function (_, match) {
            // console.log("_", _);
            // console.log("match", match);
            bindings.push(match);
            return "${map." + match.trim() + "}";
        })
            // Afterwards, replace anything that's not ${map.expressions}' (etc) with a blank string.
            // .replace(/(\$\{(?!map\.)[^}]+\})/g, '');
            // .replace(/(\{(?!map\.)[^}]+\})/g, '');
            .replace(/(\{\{(?!map\.)[^}]+\}\})/g, '');
        return Function('map', "return `" + sanitized + "`");
    };
    /**
     * @param {?} template
     * @param {?} map
     * @param {?=} bindings
     * @return {?}
     */
    Template.prototype.parseTpl = function (template, map, bindings) {
        if (bindings === void 0) { bindings = []; }
        // console.log("parseTpl:map:", map);
        var /** @type {?} */ parser = this.cache[template] = this.cache[template] || this.createParser(template, bindings);
        // console.log("parser:", parser);
        return map ? parser(map) : parser;
    };
    
    // get(path, obj, fb = `$\{${path}}`):string {
    //   return path.split('.').reduce((res, key) => res[key] || fb, obj);
    // }
    // parseTpl(template, map, fallback): string {
    //   return template.replace(/\$\{.+?}/g, (match) => {
    //     const path = match.substr(2, match.length - 3).trim();
    //     return this.get(path, map, fallback);
    //   });
    // }
    /**
    * Produces a function which uses template strings to do simple interpolation from objects.
    *
    * Usage:
    *    var makeMeKing = generateTemplateString('${name} is now the king of ${country}!');
    *
    *    console.log(makeMeKing({ name: 'Bryan', country: 'Scotland'}));
    *    // Logs 'Bryan is now the king of Scotland!'
    */
    //  generateTemplateString(x: string): (template: string) => string {
    //      var cache = {};
    //      function generateTemplate(template: string) {
    //          var fn = cache[template];
    //          if (!fn) {
    //              // Replace ${expressions} (etc) with ${map.expressions}.
    //              var sanitized = template
    //                  .replace(/\$\{([\s]*[^;\s\{]+[\s]*)\}/g, function(_, match){
    //                      return `\$\{map.${match.trim()}\}`;
    //                  })
    //              // Afterwards, replace anything that's not ${map.expressions}' (etc) with a blank string.
    //              .replace(/(\$\{(?!map\.)[^}]+\})/g, '');
    //              fn = cache[template] = Function('map', `return \`${sanitized}\``);
    //          }
    //          return fn;
    //      }
    //      return generateTemplate;
    //  }
    Template.decorators = [
        { type: Injectable },
    ];
    /**
     * @nocollapse
     */
    Template.ctorParameters = function () { return []; };
    return Template;
}());

/**
 * @abstract
 */
var RequestCache = /** @class */ (function () {
    function RequestCache() {
    }
    /**
     * @abstract
     * @param {?} req
     * @return {?}
     */
    RequestCache.prototype.get = function (req) { };
    /**
     * @abstract
     * @param {?} req
     * @param {?} response
     * @return {?}
     */
    RequestCache.prototype.put = function (req, response) { };
    return RequestCache;
}());
// #enddocregion request-cache
var maxAge = 30000;
var RequestCacheWithMap = /** @class */ (function () {
    function RequestCacheWithMap() {
        this.cache = new Map();
    }
    /**
     * @param {?} req
     * @return {?}
     */
    RequestCacheWithMap.prototype.get = function (req) {
        var /** @type {?} */ url = req.urlWithParams;
        var /** @type {?} */ cacheItem = localStorage.getItem(url);
        var /** @type {?} */ cached = JSON.parse(cacheItem);
        // const cached = this.cache.get(url);
        if (!cached) {
            return undefined;
        }
        var /** @type {?} */ isExpired = cached.lastRead < (Date.now() - maxAge);
        return isExpired ? undefined : cached.response;
    };
    /**
     * @param {?} req
     * @param {?} response
     * @return {?}
     */
    RequestCacheWithMap.prototype.put = function (req, response) {
        // console.log("RequestCacheWithMap PUT");
        var /** @type {?} */ url = req.urlWithParams;
        // this.messenger.add(`Caching response from "${url}".`);
        var /** @type {?} */ entry = { url: url, response: response, lastRead: Date.now() };
        var /** @type {?} */ cacheItem = JSON.stringify(entry);
        localStorage.setItem(url, cacheItem);
        // this.cache.set(url, entry);
        // console.log(`${url}`, cacheItem);
        // remove expired cache entries
        
        // this.cache.forEach(entry => {
        //     if (entry.lastRead < expired) {
        //         this.cache.delete(entry.url);
        //     }
        // });
        // this.messenger.add(`Request cache size: ${this.cache.size}.`);
    };
    RequestCacheWithMap.decorators = [
        { type: Injectable },
    ];
    /**
     * @nocollapse
     */
    RequestCacheWithMap.ctorParameters = function () { return []; };
    return RequestCacheWithMap;
}());

// #docplaster
var CachingInterceptor = /** @class */ (function () {
    /**
     * @param {?} cache
     */
    function CachingInterceptor(cache) {
        this.cache = cache;
    }
    /**
     * @param {?} req
     * @param {?} next
     * @return {?}
     */
    CachingInterceptor.prototype.intercept = function (req, next) {
        //console.log("CachingInterceptor");
        // continue if not cachable.
        if (!isCachable(req)) {
            return next.handle(req);
        }
        var /** @type {?} */ cachedResponse = this.cache.get(req);
        // #enddocregion v1
        // #docregion intercept-refresh
        // cache-then-refresh
        if (req.headers.get('x-refresh')) {
            var /** @type {?} */ results$ = sendRequest(req, next, this.cache);
            return cachedResponse
                ? results$.pipe(startWith(cachedResponse))
                : results$;
        }
        // cache-or-fetch
        // #docregion v1
        return cachedResponse ?
            of$1(cachedResponse) : sendRequest(req, next, this.cache);
        // #enddocregion intercept-refresh
    };
    CachingInterceptor.decorators = [
        { type: Injectable },
    ];
    /**
     * @nocollapse
     */
    CachingInterceptor.ctorParameters = function () { return [
        { type: RequestCache, },
    ]; };
    return CachingInterceptor;
}());
/**
 * Is this request cachable?
 * @param {?} req
 * @return {?}
 */
function isCachable(req) {
    // Only GET requests are cachable
    //   return req.method === 'GET' &&
    //     // Only npm package search is cachable in this app
    //     -1 < req.url.indexOf(searchUrl);
    return true;
}
/**
 * Get server response observable by sending request to `next()`.
Will add the response to the cache on the way out.
 * @param {?} req
 * @param {?} next
 * @param {?} cache
 * @return {?}
 */
function sendRequest(req, next, cache) {
    // No headers allowed in npm search request
    var /** @type {?} */ noHeaderReq = req.clone({ headers: new HttpHeaders() });
    return next.handle(noHeaderReq).pipe(tap(function (event) {
        // There may be other events besides the response.
        if (event instanceof HttpResponse) {
            cache.put(req, event); // Update the cache.
        }
    }));
}

// #docplaster
// #docregion interceptor-providers
/* "Barrel" of Http Interceptors */
// #enddocregion interceptor-providers
// import { AuthInterceptor } from './auth-interceptor';
/**
 * Http interceptor providers in outside-in order
 */
var httpInterceptorProviders = [
    // #docregion noop-provider
    // { provide: HTTP_INTERCEPTORS, useClass: NoopInterceptor, multi: true },
    // #enddocregion noop-provider, interceptor-providers
    //   { provide: HTTP_INTERCEPTORS, useClass: EnsureHttpsInterceptor, multi: true },
    //   { provide: HTTP_INTERCEPTORS, useClass: TrimNameInterceptor, multi: true },
    //   { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    //   { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true },
    //   { provide: HTTP_INTERCEPTORS, useClass: UploadInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true },
];
// #enddocregion interceptor-providers

var DataBrokerModule = /** @class */ (function () {
    function DataBrokerModule() {
    }
    /**
     * @return {?}
     */
    DataBrokerModule.forRoot = function () {
        return {
            ngModule: DataBrokerModule,
            providers: [DataBrokerService]
        };
    };
    DataBrokerModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule,
                        HttpClientModule,
                    ],
                    exports: [],
                    declarations: [],
                    providers: [
                        DataBrokerService,
                        Template,
                        { provide: RequestCache, useClass: RequestCacheWithMap },
                        httpInterceptorProviders,
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    DataBrokerModule.ctorParameters = function () { return []; };
    return DataBrokerModule;
}());

var DefaultType = {};
DefaultType.array = /** @type {?} */ ('array');
DefaultType.object = /** @type {?} */ ('object');
DefaultType.string = /** @type {?} */ ('string');
DefaultType[DefaultType.array] = "array";
DefaultType[DefaultType.object] = "object";
DefaultType[DefaultType.string] = "string";

var IHandler = /** @class */ (function () {
    function IHandler() {
    }
    /**
     * @param {?} dataSource
     * @return {?}
     */
    IHandler.prototype.handle = function (dataSource) {
    };
    return IHandler;
}());

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var StaticHandler = /** @class */ (function (_super) {
    __extends(StaticHandler, _super);
    /**
     * @param {?} injector
     * @param {?} dataBroker
     */
    function StaticHandler(injector, dataBroker) {
        var _this = _super.call(this) || this;
        _this.injector = injector;
        _this.dataBroker = dataBroker;
        return _this;
    }
    /**
     * @param {?} dataSource
     * @return {?}
     */
    StaticHandler.prototype.handle = function (dataSource) {
        // console.debug(`DataBrokerService:sendStaticData("${dataSource.id}")`);
        // let dataSource = this.dataBroker.getDataSource(serviceId);
        var /** @type {?} */ config;
        if (!dataSource.hasOwnProperty('config')) {
            return;
        }
        config = /** @type {?} */ (dataSource.config);
        this.dataBroker.publishData(dataSource.id, config.data);
    };
    return StaticHandler;
}(IHandler));

var __extends$1 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var HttpResponseType = {};
HttpResponseType.arraybuffer = /** @type {?} */ ('arraybuffer');
HttpResponseType.blob = /** @type {?} */ ('blob');
HttpResponseType.json = /** @type {?} */ ('json');
HttpResponseType.text = /** @type {?} */ ('text');
HttpResponseType[HttpResponseType.arraybuffer] = "arraybuffer";
HttpResponseType[HttpResponseType.blob] = "blob";
HttpResponseType[HttpResponseType.json] = "json";
HttpResponseType[HttpResponseType.text] = "text";
var HttpGetHandler = /** @class */ (function (_super) {
    __extends$1(HttpGetHandler, _super);
    /**
     * @param {?} injector
     * @param {?} dataBroker
     */
    function HttpGetHandler(injector, dataBroker) {
        var _this = _super.call(this) || this;
        _this.injector = injector;
        _this.dataBroker = dataBroker;
        _this.http = injector.get(HttpClient);
        _this.template = injector.get(Template);
        return _this;
    }
    /**
     * @param {?} dataSource
     * @return {?}
     */
    HttpGetHandler.prototype.handle = function (dataSource) {
        // TODO: check for fullyQualifiedDomain
        // if (fullyQualifiedDomain)
        var _this = this;
        // serviceId: string
        // if (this.dataBroker.hasDataSource(serviceId)) {
        // let dataSource = this.dataBroker.getDataSource(serviceId);
        var /** @type {?} */ config;
        if (!dataSource.hasOwnProperty('config')) {
            return;
        }
        config = /** @type {?} */ (dataSource.config);
        if (!config.hasOwnProperty('url')) {
            console.error('<HttpGet>DataSource.config missing \'url\'');
            return;
        }
        var /** @type {?} */ serviceUrlTmpl = config.url;
        if (serviceUrlTmpl !== null) {
            var /** @type {?} */ dObject = {};
            var /** @type {?} */ ctx = this.dataBroker.getDataPublisher('context');
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
            var /** @type {?} */ matches = [];
            var /** @type {?} */ serviceUrl = this.template.parseTpl(serviceUrlTmpl, dObject, matches);
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
            var /** @type {?} */ responseType = 'json';
            // console.log("serviceUrl", serviceUrl);
            // TODO: This probably won't work...
            this.http.get(serviceUrl, { responseType: /** @type {?} */ (responseType) })
                .pipe(catchError$1(this.handleError))
                .subscribe(function (data) {
                var /** @type {?} */ sId = dataSource.id;
                // console.debug(" refreshData Received from:", sId, "data:", data);
                _this.dataBroker.publishData(sId, data);
            }, function (error) {
            });
        }
        // }
        // else
        // {
        //     console.error(` refreshData:serviceId: "${serviceId}" not found.`);
        // }
        // return this.data.get(service);
    };
    /**
     * @param {?} error
     * @return {?}
     */
    HttpGetHandler.prototype.handleError = function (error) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        }
        else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error("Backend returned code " + error.status + ", " +
                ("body was: " + error.error));
        }
        // return an ErrorObservable with a user-facing error message
        return new ErrorObservable$1('Something bad happened; please try again later.');
    };
    
    return HttpGetHandler;
}(IHandler));

var __extends$2 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var HttpPostHandler = /** @class */ (function (_super) {
    __extends$2(HttpPostHandler, _super);
    /**
     * @param {?} injector
     * @param {?} dataBroker
     */
    function HttpPostHandler(injector, dataBroker) {
        var _this = _super.call(this) || this;
        _this.injector = injector;
        _this.dataBroker = dataBroker;
        _this.http = injector.get(HttpClient);
        _this.template = injector.get(Template);
        return _this;
    }
    /**
     * @param {?} dataSource
     * @return {?}
     */
    HttpPostHandler.prototype.handle = function (dataSource) {
        // if (this.dataBroker.hasDataSource(serviceId)) {
        // let dataSource = this.dataBroker.getDataSource(serviceId);
        var _this = this;
        // this.dataSources.get(serviceId).id;
        var /** @type {?} */ dataSourceConfig = /** @type {?} */ (dataSource.config);
        var /** @type {?} */ dataSubscriber = this.dataBroker.subscribeData(dataSource.id)
            .subscribe(function (body) {
            var /** @type {?} */ config = dataSourceConfig;
            var /** @type {?} */ serviceUrl = config.url;
            var /** @type {?} */ httpOptions = {};
            _this.http.post(serviceUrl, body, httpOptions)
                // .pipe(
                //     catchError(this.handleError('addHero', body))
                // )
                .subscribe(function (data) {
                if (config.result) {
                    var /** @type {?} */ result = config.result;
                    _this.dataBroker.publishData(result, data);
                }
            });
        });
    };
    /**
     * @param {?} error
     * @return {?}
     */
    HttpPostHandler.prototype.handleError = function (error) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        }
        else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error("Backend returned code " + error.status + ", " +
                ("body was: " + error.error));
        }
        // return an ErrorObservable with a user-facing error message
        return new ErrorObservable$1('Something bad happened; please try again later.');
    };
    
    return HttpPostHandler;
}(IHandler));

export { DataBrokerModule, DataBrokerService, DefaultType, Template, StaticHandler, HttpGetHandler, HttpResponseType, HttpPostHandler };
