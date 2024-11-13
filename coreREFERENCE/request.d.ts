import { type RequestWrapper } from './types';
export declare class RequestUtils implements RequestWrapper {
    private request;
    private _params;
    private _pathname;
    constructor(request: Request);
    get method(): string;
    get url(): string;
    get headers(): Headers;
    getPathname(): string;
    reqHasHeader(name: string): boolean;
    reqHeader(name: string): string | null;
    reqAllHeaders(): Record<string, string>;
    getCookie(name: string): string | null;
    reqJson<T>(): Promise<T>;
    reqText(): Promise<string>;
    reqBlob(): Promise<Blob>;
    reqFormData(): Promise<FormData>;
    hasBody(): boolean;
    isJson(): boolean;
    isHtml(): boolean;
    isFormData(): boolean;
    param<K extends string>(key: K): string | null;
    query<K extends string>(): Record<K, string | string[]>;
    hasQueryParam<K extends string>(key: K): boolean;
    reqQueryParams<K extends string>(...keys: K[]): Record<K, string | null>;
}
