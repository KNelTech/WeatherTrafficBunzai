import type { RequestWrapper, JsonValue } from './types';
export declare class RequestUtils implements RequestWrapper {
    private readonly request;
    private readonly _params;
    private _pathname;
    private _bodyUsed;
    constructor(request: Request);
    private assertBodyNotUsed;
    get method(): string;
    get url(): string;
    get headers(): Headers;
    param<K extends string>(key: K): string | null;
    query<K extends string>(): Record<K, string | string[]>;
    getParams<K extends string>(...keys: K[]): Record<K, string | null>;
    reqHeader(name: string): string | null;
    reqAllHeaders(): Record<string, string>;
    getPathname(): string;
    getContentType(): string | null;
    getBody<T extends JsonValue | FormData | string | ArrayBuffer | null>(this: RequestUtils): Promise<T | null>;
    hasHeader(name: string): boolean;
    hasBody(): boolean;
    hasParam<K extends string>(key: K): boolean;
}
