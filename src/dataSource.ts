export interface DataSource {
    $schema?: object;
    id: string;
    dataSourceType: string;

    defaultType: DefaultType;
    name?: string;
    parameters?: DataSourceParameters[];

    config?: object;
}

export interface DataSourceParameters {
    ParameterId: string;
    ParameterName: string;
    ParameterValue: string;
}

// // TODO: <any> is hacky
// // https://github.com/dherges/ng-packagr/issues/206
// export enum DataSourceType {
//     HttpGet = <any>'HttpGet',
//     HttpPost = <any>'HttpPost',
//     SignalR = <any>'SignalR',
//     Static = <any>'Static',
//     Subscriber = <any>'Subscriber',
//     Websockets = <any>'Websocket'
// }

// TODO: <any> is hacky
// https://github.com/dherges/ng-packagr/issues/206
export enum DefaultType {
    array = <any>'array',
    object = <any>'object',
    string = <any>'string'
}
