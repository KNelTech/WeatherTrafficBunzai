import type { BunFile } from 'bun';
import type { Bunzai } from './bunzai';
export type MiddlewareTiming = 'pre' | 'post';
export type Next = () => Promise<void>;
export type Middleware = (c: Context, next: Next) => Promise<void | Response> | Response | void;
export type Handler = (c: Context) => Promise<Response | string | object> | Response | string | object;
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
export type HttpStatus = Response['status'];
export type JsonPrimitive = string | number | boolean | null;
export type JsonArray = readonly JsonValue[];
export type JsonObject = {
    readonly [key: string]: JsonValue;
};
export type JsonValue = JsonPrimitive | JsonObject | JsonArray | undefined;
export type DeepPartial<T> = T extends JsonPrimitive ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends object ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : T;
export type AsJsonValue<T> = T extends JsonValue ? T : never;
export declare const isJsonPrimitive: (value: unknown) => value is JsonPrimitive;
export declare const isJsonArray: (value: unknown) => value is JsonArray;
export declare const isJsonObject: (value: unknown) => value is JsonObject;
export declare const isJsonValue: (value: unknown) => value is JsonValue;
export declare const safeJsonParse: (text: string) => JsonValue | undefined;
export interface Route {
    regex?: RegExp;
    path: string;
    method: HTTPMethod;
    handler: Handler;
    params: Map<string, string>;
    originalPath: string;
    optionalParams: Set<string | undefined>;
    keys: Set<string>;
    middleware: Middleware[];
}
export interface IRouter {
    addRoute(method: HTTPMethod, path: string, handler: Handler, middleware: Middleware[]): IRouter;
    findRoute(method: HTTPMethod, path: string): {
        route: Route;
        params: Map<string, string>;
    } | undefined;
    getRoutes(): Route[];
    handleRequest(path: string, method: HTTPMethod, context: Context): Promise<Response | undefined>;
}
export declare class TrieNode {
    children: Map<string, TrieNode>;
    route: Route | null;
    isParam: boolean;
    paramName: string;
    isOptional: boolean;
    isWildcard: boolean;
    regex: RegExp | null;
}
export type RouteHandler = {
    [key in HTTPMethod]?: string | [string, Handler];
};
export type CookieOptions = {
    domain?: string;
    path?: string;
    secure?: boolean;
    httpOnly?: boolean;
    expires?: Date;
    maxAge?: number;
    sameSite?: 'Strict' | 'Lax' | 'None';
    signed?: boolean;
    secret?: string;
};
export interface SigningOptions {
    type: 'hmac' | 'jwt';
    secret: string;
    jwtOptions?: any;
    jwtSign?: (value: string, secret: string, options?: any) => string;
    jwtVerify?: (token: string, secret: string) => string | null;
}
export interface BunzaiErrorOptions {
    message: string;
    status?: number;
    code?: string;
    details?: JsonObject;
}
export interface IBunzaiError extends Error {
    status: number;
    code?: string;
    details?: JsonObject;
}
export type PluginOptions = Record<string, unknown>;
export interface Plugin {
    readonly name: string;
    readonly version?: string;
    readonly dependencies?: readonly PluginDependency[];
    readonly install: (app: Bunzai, api: BunzaiPluginAPI, options?: PluginOptions) => void | Promise<void>;
    uninstall?: (app: Bunzai) => void | Promise<void>;
}
export interface PluginDependency {
    name: string;
    version?: string;
    optional?: boolean;
}
export interface BunzaiPluginAPI {
    addMiddleware(path: string, ...middlewares: Middleware[]): void;
    extendContext<T extends Record<string, unknown>>(extensions: T & ThisType<ContextExtensions & T>): void;
    registerNamespace(namespace: string, methods: Record<string, Function>): void;
    getInstalledPlugins(): readonly Plugin[];
    getPluginDependencyGraph: () => Readonly<Record<string, readonly PluginDependency[]>>;
    getPluginNamespaces(pluginName: string): string[];
    isPluginRegistered(pluginName: string): boolean;
    getAllNamespaces(): string[];
    isPluginInstalled(pluginName: string): boolean;
    namespaceExists(namespace: string): boolean;
}
export declare function extendContext<T extends Record<string, unknown>>(extensions: T & ThisType<ContextExtensions & T>): asserts extensions is T;
export interface RequestWrapper {
    method: string;
    url: string;
    headers: Headers;
    param(key: string): string | null;
    query(): Record<string, string | string[]>;
    getParams(...keys: string[]): Record<string, string | null>;
    reqHeader(name: string): string | null;
    reqAllHeaders(): Record<string, string>;
    getPathname(): string;
    getContentType(): string | null;
    getBody<T extends JsonValue | FormData | string | ArrayBuffer | null>(): Promise<T | null>;
    hasHeader(name: string): boolean;
    hasBody(): boolean;
    hasParam(key: string): boolean;
}
export type ResponseOptions = {
    status?: HttpStatus;
    statusText?: string;
    headers?: Record<string, string>;
};
export interface ResponseWrapper {
    json<T>(data: AsJsonValue<T>, options?: ResponseOptions): Response;
    text(text: string, options?: ResponseOptions): Response;
    html(html: string, options?: ResponseOptions): Response;
    redirect(url: string, options?: ResponseOptions): Response;
    notFound(message?: string, options?: ResponseOptions): Response;
    badRequest(message?: string, options?: ResponseOptions): Response;
    serverError(message?: string, options?: ResponseOptions): Response;
    created<T extends object = Record<string, any>>(data: T, options?: ResponseOptions): Response;
    noContent(options?: ResponseOptions): Response;
    file(data: Blob | ArrayBuffer | ReadableStream, filename: string, options?: ResponseOptions): Response;
    formData(data: FormData, options?: ResponseOptions): Response;
    stream(stream: ReadableStream<Uint8Array>, options?: ResponseOptions): Response;
    appendHeader(name: string, value: string): void;
    setHeader(name: string, value: string): void;
    setHeaders(headers: Record<string, string>): void;
    getHeader(name: string): string | null;
    getAllHeaders(): Record<string, string>;
    removeHeader(name: string): void;
    setResponse(response: Response): void;
    getResponse(): Response | null;
    getStatus(): HttpStatus;
}
export interface ContextExtensions {
    [key: string]: any;
}
export interface Context {
    [key: string]: ContextExtensions[keyof ContextExtensions];
    setCookie(name: string, value: string, options?: CookieOptions & {
        signing?: SigningOptions;
    }): void;
    getCookie(name: string, options?: {
        signing?: SigningOptions;
    }): string | null;
    delCookie(name: string, options?: Omit<CookieOptions, 'maxAge' | 'sameSite'>): void;
    set<T>(key: string, value: T): void;
    get<T>(key: string): T | undefined;
    has(key: string): boolean;
    delete(key: string): void;
    getAllKeys(): string[];
    getAll(): ReadonlyMap<string, unknown>;
    setParam(key: string, value: string): void;
    setParams(params: Record<string, string>): void;
    getParam(key: string): string | undefined;
    getAllParams(): Record<string, string>;
    getResponse(): Response | null;
    setResponse(response: Response): void;
    updateResponse(newResponse: Response): void;
    getMethod(): string;
    getUrl(): string;
    getHeaders(): Headers;
    param(key: string): string | null;
    query(): Record<string, string | string[]>;
    getParams(...keys: string[]): Record<string, string | null>;
    reqHeader(name: string): string | null;
    reqAllHeaders(): Record<string, string>;
    getPathname(): string;
    getContentType(): string | null;
    getBody(): Promise<JsonValue | FormData | string | ArrayBuffer | null>;
    hasHeader(name: string): boolean;
    hasBody(): boolean;
    hasParam(key: string): boolean;
    json<T>(data: AsJsonValue<T>, options?: ResponseOptions): Response;
    text(text: string, options?: ResponseOptions): Response;
    html(html: string, options?: ResponseOptions): Response;
    redirect(url: string, options?: ResponseOptions): Response;
    notFound(message?: string, options?: ResponseOptions): Response;
    badRequest(message?: string, options?: ResponseOptions): Response;
    serverError(message?: string, options?: ResponseOptions): Response;
    created<T extends object = Record<string, any>>(data: T, options?: ResponseOptions): Response;
    noContent(options?: ResponseOptions): Response;
    file(data: Blob | ArrayBuffer | ReadableStream | BunFile, filename: string, options?: ResponseOptions): Response;
    formData(data: FormData, options?: ResponseOptions): Response;
    stream(stream: ReadableStream<Uint8Array>, options?: ResponseOptions): Response;
    appendHeader(name: string, value: string): void;
    setHeader(name: string, value: string): void;
    setHeaders(headers: Record<string, string>): void;
    getHeader(name: string): string | null;
    getAllHeaders(): Record<string, string>;
    removeHeader(name: string): void;
    setResponse(response: Response): void;
    getResponse(): Response | null;
}
export interface BunzaiConfig {
    errorHandler?: boolean;
}
export interface App {
    plugin: (plugin: Plugin, options?: PluginOptions) => this;
    usePlugin: (namespace: string) => Record<string, Function>;
    use(pathOrMiddleware: string | Middleware | Middleware[], ...middlewares: (Middleware | MiddlewareTiming)[]): this;
    route(basePath: string, ...subApps: Bunzai[]): this;
    routeHandler(routeHandler: RouteHandler): void;
    useWhen(condition: (c: Context) => boolean, ...middlewares: Middleware[]): this;
    get(path: string, handler: Handler): this;
    post(path: string, handler: Handler): this;
    put(path: string, handler: Handler): this;
    patch(path: string, handler: Handler): this;
    delete(path: string, handler: Handler): this;
    head(path: string, handler: Handler): this;
    options(path: string, handler: Handler): this;
    listen(port?: number, hostname?: string): Promise<{
        port: number;
        hostname: string;
    }>;
}
