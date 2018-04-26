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
export declare enum DefaultType {
    array,
    object,
    string,
}
