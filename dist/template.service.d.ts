export declare class Template {
    cache: object;
    createParser(template: string, bindings: string[]): Function;
    parseTpl(template: string, map: object, bindings?: string[]): string;
}
