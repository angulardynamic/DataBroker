export interface Query {
    type: BoolType;
    filters: Filter[];
}

export interface Filter {
    field: string;
    op: OpType;
    filterBinding: string;
}

// TODO: <any> is hacky
// https://github.com/dherges/ng-packagr/issues/206
export enum BoolType {
    or = <any>'or',
    and = <any>'and'
}

// TODO: <any> is hacky
// https://github.com/dherges/ng-packagr/issues/206
export enum OpType {
    eq = <any>'eq',
    like = <any>'like',
    gt = <any>'gt',
    gte = <any>'gte',
    lt = <any>'lt',
    lte = <any>'lte'
}
