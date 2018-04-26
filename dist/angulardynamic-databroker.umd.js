(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/common/http'), require('lodash'), require('rxjs/BehaviorSubject'), require('rxjs/observable/of'), require('rxjs/operators')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common', '@angular/common/http', 'lodash', 'rxjs/BehaviorSubject', 'rxjs/observable/of', 'rxjs/operators'], factory) :
	(factory((global['angulardynamic-databroker'] = {}),global.core,global.common,global.http,global.lodash,global.BehaviorSubject,global.of,global.operators));
}(this, (function (exports,core,common,http,lodash,BehaviorSubject,of,operators) { 'use strict';

// import { Subscription } from 'rxjs/Subscription';
// import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
// import { catchError, retry } from 'rxjs/operators';
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
        if (dataSource === undefined || lodash.isEmpty(dataSource)) {
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
        this.dataPublishers.set(subject, new BehaviorSubject.BehaviorSubject(defaultData));
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
            this.dataPublishers.set(subject, new BehaviorSubject.BehaviorSubject(data));
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
        { type: core.Injectable },
    ];
    /**
     * @nocollapse
     */
    DataBrokerService.ctorParameters = function () { return [
        { type: core.Injector, },
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
        { type: core.Injectable },
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
        { type: core.Injectable },
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
                ? results$.pipe(operators.startWith(cachedResponse))
                : results$;
        }
        // cache-or-fetch
        // #docregion v1
        return cachedResponse ?
            of.of(cachedResponse) : sendRequest(req, next, this.cache);
        // #enddocregion intercept-refresh
    };
    CachingInterceptor.decorators = [
        { type: core.Injectable },
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
    var /** @type {?} */ noHeaderReq = req.clone({ headers: new http.HttpHeaders() });
    return next.handle(noHeaderReq).pipe(operators.tap(function (event) {
        // There may be other events besides the response.
        if (event instanceof http.HttpResponse) {
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
    { provide: http.HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true },
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
        { type: core.NgModule, args: [{
                    imports: [
                        common.CommonModule,
                        http.HttpClientModule,
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

exports.DataBrokerModule = DataBrokerModule;
exports.DataBrokerService = DataBrokerService;
exports.DefaultType = DefaultType;
exports.Template = Template;

Object.defineProperty(exports, '__esModule', { value: true });

})));
