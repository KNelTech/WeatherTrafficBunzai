import type { ResponseOptions, CookieOptions, Context as IContext, AsJsonValue } from './types';
import type { JSXElement, JSXChild, JSXResult, JSXComponent, JSXElementType, JSXProps, HttpStatus } from './types';
import type { BunFile } from 'bun';
export declare class Context implements IContext {
    private readonly req;
    private readonly res;
    private params;
    private readonly locals;
    constructor(request: Request);
    renderJSX(element: JSXElement): JSXResult;
    createComponent<P extends JSXProps>(component: JSXComponent<P>): JSXComponent<P & {
        children?: JSXChild[];
    }>;
    jsx(type: JSXElementType, props: JSXProps | null, ...children: JSXChild[]): Response;
    set<T>(key: string, value: T): void;
    get<T>(key: string): T | undefined;
    has(key: string): boolean;
    delete(key: string): void;
    getAll(): ReadonlyMap<string, {
        type: string;
        value: unknown;
    }>;
    getAllKeys(): string[];
    setParam(key: string, value: string): void;
    setParams(params: Record<string, string>): void;
    getParam(key: string): string | undefined;
    getAllParams(): Readonly<Record<string, string>>;
    getResponse(): Response;
    setResponse(response: Response): this;
    updateResponse(newResponse: Response): void;
    getPathname(): string;
    getMethod(): string;
    getUrl(): string;
    getHeaders(): Headers;
    reqHasHeader(name: string): boolean;
    reqHeader(name: string): string | null;
    reqAllHeaders(): Record<string, string>;
    reqJson<T = any>(): Promise<T>;
    reqText(): Promise<string>;
    reqBlob(): Promise<Blob>;
    reqFormData(): Promise<FormData>;
    hasBody(): boolean;
    isJson(): boolean;
    isHtml(): boolean;
    isFormData(): boolean;
    param(key: string): string | null;
    query(): Record<string, string | string[]>;
    hasQueryParam(key: string): boolean;
    reqQueryParams(...keys: string[]): Record<string, string | null>;
    json<T>(data: AsJsonValue<T>, options?: ResponseOptions): Response;
    text(text: string, options?: ResponseOptions): Response;
    html(html: string, options?: ResponseOptions): Response;
    redirect(url: string, options?: ResponseOptions): Response;
    notFound(message?: string, options?: ResponseOptions): Response;
    badRequest(message?: string): Response;
    serverError(message?: string): Response;
    created<T extends object = Record<string, any>>(data: T, options?: ResponseOptions): Response;
    file(data: Blob | ArrayBuffer | ReadableStream | BunFile, filename: string, options?: ResponseOptions): Response;
    formData(data: FormData, options?: ResponseOptions): Response;
    stream(stream: ReadableStream<Uint8Array>, options?: ResponseOptions): Response;
    setCookie(name: string, value: string, options?: CookieOptions): void;
    getCookie(name: string): string | null;
    delCookie(name: string, options?: Omit<CookieOptions, 'maxAge' | 'sameSite'>): void;
    appendHeader(name: string, value: string): void;
    setHeader(name: string, value: string): void;
    setHeaders(headers: Record<string, string>): void;
    getHeader(name: string): string | null;
    getAllHeaders(): Record<string, string>;
    removeHeader(name: string): void;
    noContent(options?: ResponseOptions): Response;
    getStatus(): HttpStatus;
}
