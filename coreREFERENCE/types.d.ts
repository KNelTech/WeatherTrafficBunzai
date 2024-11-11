import type { BunFile } from 'bun';
export type Next = () => Promise<void>;
export type Middleware = (c: Context, next: Next) => Promise<void | Response> | Response | void;
export type Handler = (c: Context) => Promise<Response> | Response;
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
export type HttpStatus = 100 | 200 | 201 | 204 | 301 | 302 | 304 | 308 | 400 | 401 | 403 | 404 | 500 | 501 | 502 | 503 | 504;
export type RouterStrategyType = 'trie' | 'regexp';
export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export type JsonObject = {
    readonly [key: string]: JsonValue | undefined;
};
export interface JsonArray extends ReadonlyArray<JsonValue> {
}
type DeepPartial<T> = T extends JsonPrimitive ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends object ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : T;
/**
 * Utility type to convert any type to a JSON-compatible type.
 * If the type T is compatible with the JsonValue type (i.e. it is a primitive, an object, or an array of primitives/objects), then this type is the same as T.
 * If the type T is not compatible with the JsonValue type, then this type is never.
 */
export type AsJsonValue<T> = DeepPartial<T> extends JsonValue ? DeepPartial<T> : never;
type Primitive = string | number | boolean | null | undefined;
export type JSXChild = JSXElement | Primitive;
export type JSXElementType = string | JSXComponent<any>;
export interface JSXElement {
    type: JSXElementType;
    props: Record<string, unknown>;
    children: JSXChild[];
}
export type JSXResult = string;
export type JSXComponent<P = Record<string, unknown>> = (props: P & {
    children?: JSXChild[];
}) => JSXResult;
export interface Route {
    regex?: RegExp;
    path: RegExp | string | undefined;
    method: HTTPMethod;
    handler: Handler;
    params: string[];
    originalPath: string;
    keys: string[];
    middleware: Middleware[];
    routerStrategy: RouterStrategyType;
}
export interface RouterStrategy {
    addRoute(method: HTTPMethod, path: string, handler: Handler, middleware: Middleware[], strategy: RouterStrategyType): void;
    findRoute(method: HTTPMethod, path: string, strategy: RouterStrategyType): {
        route: Route;
        params: Record<string, string>;
    } | undefined;
    getRoutes(): Route[];
    handleRequest(path: string, method: HTTPMethod, context: Context, strategy: RouterStrategyType): Promise<Response | undefined>;
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
};
export interface RequestWrapper {
    method: string;
    url: string;
    headers: Headers;
    reqHasHeader(name: string): boolean;
    reqHeader(name: string): string | null;
    reqAllHeaders(): Record<string, string>;
    getCookie(name: string): string | null;
    reqJson<T = any>(): Promise<T>;
    reqText(): Promise<string>;
    reqBlob(): Promise<Blob>;
    reqFormData(): Promise<FormData>;
    hasBody(): boolean;
    isJson(): boolean;
    isFormData(): boolean;
    param(key: string): string | null;
    query(): Record<string, string | string[]>;
    hasQueryParam(key: string): boolean;
    reqQueryParams(...keys: string[]): Record<string, string | null>;
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
    setCookie(name: string, value: string, options?: CookieOptions): void;
    delCookie(name: string, options?: Omit<CookieOptions, 'maxAge' | 'sameSite'>): void;
    appendHeader(name: string, value: string): void;
    setHeader(name: string, value: string): void;
    getHeader(name: string): string | null;
    getAllHeaders(): Record<string, string>;
    removeHeader(name: string): void;
    setResponse(response: Response): void;
    getResponse(): Response | null;
}
export interface Context {
    /**
     * Renders a JSX element into a string.
     *
     * This function handles rendering both functional and class components.
     * If the element's type is a function, it is called as a functional component.
     * Otherwise, the element is rendered as a standard JSX element.
     *
     * @param element The JSX element to render.
     * @returns The rendered JSX element as a string.
     */
    renderJSX(element: JSXElement): JSXResult;
    /**
     * Caches a JSX component and returns a wrapped version of it.
     *
     * This method is used to cache the JSX components created by the
     * `createComponent` method. It returns a wrapped version of the component
     * that calls the original component with the `renderComponent` method.
     *
     * The `renderComponent` method is used to render the component with the
     * given props. It also handles the case where the component is a
     * function, and it needs to be called with the props.
     *
     * @param component The JSX component to cache and wrap.
     * @returns The wrapped JSX component.
     */
    createComponent<P extends Record<string, unknown>>(component: JSXComponent<P>): JSXComponent<P>;
    /**
     * Returns a JSXResult string from the given element.
     *
     * The first argument `type` can be a string (for built-in tags like 'div') or a function (for custom components).
     * The second argument `props` can be an object with props for the element. Set to `null` if no props are needed.
     * The rest arguments `children` are JSXChild elements that will be passed as the `children` prop of the element.
     *
     * @param {JSXElementType} type - The type of the element.
     * @param {Record<string, unknown> | null} [props=null] - The props of the element.
     * @param {...JSXChild[]} children - The children of the element.
     * @returns {Response} - The rendered JSXResult string as a Response object with content type set to 'text/html'.
     */
    jsx(type: JSXElementType, props: Record<string, unknown> | null, ...children: JSXChild[]): Response;
    /**
     * Sets a value on the context.
     * @param key - The key to set. Must be a string.
     * @param value - The value to set. Can be any type.
     * @returns Nothing. This is a setter function.
     */
    set<T extends JsonValue>(key: string, value: T): void;
    /**
     * Gets a value from the context.
     * @param key - The key to get. Must be a string.
     * @returns The value associated with the key, or undefined if the key does not exist.
     */
    get<T extends JsonValue>(key: string): T | undefined;
    /**
     * Checks if a value exists on the context.
     * @param key - The key to check. Must be a string.
     * @returns True if the key exists, false otherwise.
     */
    has(key: string): boolean;
    /**
     * Deletes a value from the context.
     * @param key - The key to delete. Must be a string.
     * @returns Nothing. This is a setter function.
     */
    delete(key: string): void;
    /**
     * Gets all values from the context.
     * @returns A map of all values in the context.
     */
    getAll(): ReadonlyMap<string, JsonValue>;
    /**
     * Sets a route parameter. This will be used to populate the "params" object that is passed to route handlers.
     * @param key - The key of the route parameter.
     * @param value - The value of the route parameter.
     */
    setParam(key: string, value: string): void;
    /**
     * Sets all route parameters at once.
     * @param params - The object with route parameter names as keys and values as values.
     */
    setParams(params: Record<string, string>): void;
    /**
     * Gets a route parameter from the context.
     * @param key - The key of the route parameter. Must be a string.
     * @returns The value of the route parameter, or undefined if the key does not exist.
     */
    getParam(key: string): string | undefined;
    /**
     * Gets all route parameters from the context.
     * @returns A map of all route parameters in the context.
     */
    getAllParams(): Record<string, string>;
    /**
     * Gets the underlying response object.
     * @returns The underlying response object if it is set, or null if it is not.
     */
    getResponse(): Response | null;
    /**
     * Sets the underlying response object.
     * @param response - The response object to set. Must be an instance of Response.
     * @returns Nothing. This is a setter function.
     */
    setResponse(response: Response): void;
    /**
     * Updates the underlying response object.
     * @param newResponse - The new response object to set. Must be an instance of Response.
     * @returns Nothing. This is a setter function.
     */
    updateResponse(newResponse: Response): void;
    /************
     ** Request **
     ************/
    getMethod(): string;
    getUrl(): string;
    getHeaders(): Headers;
    /**
     * Returns true if the request has the specified header, false otherwise.
     * @param name - The name of the header to check. Must be a string.
     * @returns A boolean indicating whether the header exists on the request.
     */
    reqHasHeader(name: string): boolean;
    /**
     * Returns the value of the specified header.
     * @param name - The name of the header to get. Must be a string.
     * @returns The value of the specified header, or null if the header does not exist.
     */
    reqHeader(name: string): string | null;
    /**
     * Returns an object with all the headers from the request.
     * @returns A Record of strings where the keys are the header names and the values are the header values.
     */
    reqAllHeaders(): Record<string, string>;
    /**
     * Returns the value of the specified cookie.
     * @param name - The name of the cookie to get. Must be a string.
     * @returns The value of the specified cookie, or null if the cookie does not exist.
     */
    getCookie(name: string): string | null;
    /**
     * Returns the request body as a JSON object.
     * @returns The request body as a T object, or throws an error if the request body is not valid JSON.
     */
    reqJson<T = any>(): Promise<T>;
    /**
     * Returns the request body as a string.
     * @returns The request body as a string.
     */
    reqText(): Promise<string>;
    /**
     * Returns the request body as a Blob.
     * @returns The request body as a Blob, or throws an error if the request body is not valid.
     */
    reqBlob(): Promise<Blob>;
    /**
     * Returns the request body as a FormData object.
     * @returns The request body as a FormData object, or throws an error if the request body is not valid.
     */
    reqFormData(): Promise<FormData>;
    /**
     * Checks if the request body is present.
     * @returns true if the request body is present, false otherwise.
     */
    hasBody(): boolean;
    /**
     * Checks if the request body is a JSON object.
     * @returns true if the request body is a JSON object, false otherwise.
     */
    isJson(): boolean;
    /**
     * Checks if the request body is a FormData object.
     * @returns true if the request body is a FormData object, false otherwise.
     */
    isFormData(): boolean;
    /**
     * Returns the value of the query parameter with the given key.
     * @param key The key of the query parameter to get.
     * @returns The value of the query parameter if it exists, or null otherwise.
     */
    param(key: string): string | null;
    /**
     * Returns the query parameters of the request.
     * @returns A Record of strings to strings or string arrays where the keys are the query parameter names and the values are the query parameter values.
     */
    query(): Record<string, string | string[]>;
    /**
     * Checks if the specified key exists in the query parameters.
     * @param key - The key to check. Must be a string.
     * @returns A boolean indicating whether the key exists in the query parameters.
     */
    hasQueryParam(key: string): boolean;
    /**
     * Gets the query parameters of the request with the given keys.
     * @param keys The keys of the query parameters to get. Must be a string or an array of strings.
     * @returns A Record of strings to strings or null where the keys are the query parameter names and the values are the query parameter values. If a key does not exist in the query parameters, the value will be null.
     */
    reqQueryParams(...keys: string[]): Record<string, string | null>;
    /*************
     ** Response **
     *************/
    /**
     * Creates a JSON response.
     * @param data - The data to send in the body of the response, serialized to JSON.
     * @param options - The options for the JSON response.
     * @returns The JSON response.
     *
     * @example
     * app.get('/', (c) => c.json({ message: 'Hello, Bunzai!' }))
     */
    json<T>(data: AsJsonValue<T>, options?: ResponseOptions): Response;
    /**
     * Creates a text response.
     * @param text - The text to send in the body of the response.
     * @param options - The options for the text response.
     * @returns The text response.
     */
    text(text: string, options?: ResponseOptions): Response;
    /**
     * Creates an HTML response.
     * @param html - The HTML to send in the body of the response.
     * @param options - The options for the HTML response.
     * @returns The HTML response.
     */
    html(html: string, options?: ResponseOptions): Response;
    /**
     * Creates a redirect response.
     * @param url - The URL to redirect to.
     * @param options - The options for the redirect.
     * @returns The redirect response.
     */
    redirect(url: string, options?: ResponseOptions): Response;
    /**
     * Creates a 404 Not Found response with a text body.
     * @param message The text to send in the body of the response. Defaults to 'Not Found'.
     * @param options The options for the text response.
     * @returns The Not Found response.
     */
    notFound(message?: string, options?: ResponseOptions): Response;
    /**
     * Creates a 400 Bad Request response with a text body.
     * @param message The text to send in the body of the response. Defaults to 'Bad Request'.
     * @param options The options for the text response.
     * @returns The Bad Request response.
     */
    badRequest(message?: string, options?: ResponseOptions): Response;
    /**
     * Creates a 500 Internal Server Error response with a text body.
     * @param message - The text to send in the body of the response. Defaults to 'Internal Server Error'.
     * @param options - The options for the text response.
     * @returns The Internal Server Error response.
     */
    serverError(message?: string, options?: ResponseOptions): Response;
    /**
     * Creates a 201 Created response with a JSON body.
     * @param data - The data to serialize to JSON and send in the body of the response.
     * @param options - The options for the JSON response.
     * @returns The Created response.
     */
    created<T extends object = Record<string, any>>(data: T, options?: ResponseOptions): Response;
    /**
     * Creates a 204 No Content response.
     * @param options - The options for the No Content response.
     * @returns The No Content response.
     */
    noContent(options?: ResponseOptions): Response;
    /**
     * Creates a response with a file as the body.
     * @param data - The data to send in the body of the response, which can be a Blob, ArrayBuffer, ReadableStream, or BunFile.
     * @param filename - The filename to use in the Content-Disposition header.
     * @param options - The options for the response.
     * @returns The response with the file as the body.
     * @example
     * app.get('/download', (c) => c.file(new Blob(['Hello, world!']), 'hello.txt'))
     * app.get('/download', (c) => c.file(Buffer.from('Hello, world!'), 'hello.txt'))
     * app.get('/download', (c) => c.file(new ReadableStream(), 'hello.txt'))
     * app.get('/download', (c) => c.file(new BunFile('hello.txt'), 'hello.txt'))
     */
    file(data: Blob | ArrayBuffer | ReadableStream | BunFile, filename: string, options?: ResponseOptions): Response;
    /**
     * Creates a form data response.
     * @param data - The form data to send in the body of the response.
     * @param options - The options for the form data response.
     * @returns A Response object.
     */
    formData(data: FormData, options?: ResponseOptions): Response;
    /**
     * Creates a response with a stream as the body.
     * @param stream - The ReadableStream to send in the body of the response.
     * @param options - The options for the response.
     * @returns A Response object.
     */
    stream(stream: ReadableStream<Uint8Array>, options?: ResponseOptions): Response;
    /**
     * Sets a cookie on the response.
     * @param name - The name of the cookie. Must be a string.
     * @param value - The value of the cookie. Must be a string.
     * @param options - The options for the cookie. Must be an instance of CookieOptions.
     * @returns Nothing. This is a setter function.
     * @example
     * app.get('/', (c) => {
     *   c.setCookie('token', '1234567890')
     *   c.setCookie('token', '1234567890', { path: '/' })
     *   c.setCookie('token', '1234567890', { path: '/user', maxAge: 900 })
     * })
     })
     */
    setCookie(name: string, value: string, options?: CookieOptions): void;
    /**
     * Deletes a cookie on the response.
     * @param name - The name of the cookie to delete. Must be a string.
     * @param options - The options for the cookie. Must be an instance of Omit<CookieOptions, 'maxAge' | 'sameSite'>.
     * @returns Nothing. This is a setter function.
     * @example
     * app.get('/', (c) => {
     *   c.delCookie('token')
     *   c.delCookie('token', { path: '/' })
     *   c.delCookie('token', { path: '/', maxAge: 0 })
     * })
     */
    delCookie(name: string, options?: Omit<CookieOptions, 'maxAge' | 'sameSite'>): void;
    /**
     * Appends a value to the specified header.
     * @param name - The name of the header to append the value to. Must be a string.
     * @param value - The value to append to the specified header. Must be a string.
     */
    appendHeader(name: string, value: string): void;
    /**
     * Sets the value of a header on the response.
     * @param name - The name of the header to set. Must be a string.
     * @param value - The value to set on the specified header. Must be a string.
     */
    setHeader(name: string, value: string): void;
    /**
     * Gets the value of the specified header.
     * @param name - The name of the header to get. Must be a string.
     * @returns The value of the specified header, or null if the header does not exist.
     */
    getHeader(name: string): string | null;
    /**
     * Returns an object with all the headers from the response.
     * @returns A Record of strings where the keys are the header names and the values are the header values.
     */
    getAllHeaders(): Record<string, string>;
    /**
     * Removes a header from the response.
     * @param name - The name of the header to remove. Must be a string.
     */
    removeHeader(name: string): void;
    /**
     * Sets the underlying response object.
     * @param response - The response object to set. Must be an instance of Response.
     */
    setResponse(response: Response): void;
    /**
     * Gets the underlying response object.
     * @returns The underlying response object if it is set, or null if it is not.
     */
    getResponse(): Response | null;
}
export interface App {
    /**
     * Mounts a static file server to the given path.
     * @param {string} path - The path prefix for the static files.
     * @param {string} staticDir - The directory to serve static files from.
     * @returns {this} The Bunzai instance.
     */
    static(path: string, staticDir: string): this;
    /**
     * Registers a middleware for a specific path or globally.
     *
     * @param {string | Middleware} pathOrMiddleware - The path or middleware to register.
     * @param {...Middleware} middlewares - Additional middlewares to register.
     * @returns {Bunzai} - The current instance of the app.
     */
    use(pathOrMiddleware: string | Middleware, ...middlewares: Middleware[]): this;
    /**
     * Routes a sub-app to a specific path.
     *
     * This method takes a base path and one or more sub-apps as arguments.
     * It will add all routes from the sub-apps to the main app's router,
     * prefixed with the base path.
     *
     * @param basePath The base path where the sub-apps should be mounted.
     * @param subApps One or more sub-apps to be mounted.
     */
    route(basePath: string, ...subApps: App[]): this;
    /**
     * Handles a route handler object. This object should have HTTP method names as
     * properties (e.g. "GET", "POST", etc.) and the value of each property should be
     * a string (the path) or an array with a string (the path) and a function (the
     * handler). If the value is a string, it will be used as the path and the handler
     * will be a 501 "Not Implemented" response.
     *
     * @param routeHandler The route handler object to handle.
     * @returns void
     * @throws Will throw an error if the route handler object is invalid.
     * @example
     * app.routeHandler({
     *   GET: '/get' or ['/get', (c) => { ... }],
     *   POST: '/post' or ['/post', (c) => { ... }],
     *   DELETE: '/delete' or ['/delete', (c) => { ... }],
     * })
     */
    routeHandler(routeHandler: RouteHandler): void;
    /**
     * Group a list of middlewares together, so they can be registered with {@link use} or {@link useWhen}.
     *
     * @param middlewares - A list of middlewares to group together.
     * @returns A single middleware that runs all the grouped middlewares in order.
     */
    group(...middlewares: Middleware[]): Middleware;
    /**
     * Conditionally use middleware.
     *
     * @param condition - A function that takes a `Context` object and returns a boolean.
     * @param ...middlewares - One or more middleware functions.
     * @returns This instance of `Bunzai`.
     */
    useWhen(condition: (c: Context) => boolean, ...middlewares: Middleware[]): this;
    /**
     * Registers a GET route.
     * @param path The path of the route. Must be a string.
     * @param handler The handler for the route. Must be a function that takes a Context and a Next as arguments and returns a Promise<void>.
     */
    get(path: string, handler: Handler): this;
    /**
     * Registers a POST route.
     * @param path The path of the route. Must be a string.
     * @param handler The handler for the route. Must be a function that takes a Context and a Next as arguments and returns a Promise<void>.
     * @returns This instance of Bunzai.
     */
    post(path: string, handler: Handler): this;
    /**
     * Registers a PUT route.
     * @param path The path of the route. Must be a string.
     * @param handler The handler for the route. Must be a function that takes a Context and a Next as arguments and returns a Promise<void>.
     * @returns This instance of Bunzai.
     */
    put(path: string, handler: Handler): this;
    /**
     * @param path - The path to handle with the PATCH method. Must be a string.
     * @param handler - The handler function to call when the route is matched. Must be a Handler.
     * @returns The current Bunzai instance.
     */
    patch(path: string, handler: Handler): this;
    /**
     * Registers a DELETE route.
     * @param path The path of the route. Must be a string.
     * @param handler The handler for the route. Must be a function that takes a Context and a Next as arguments and returns a Promise<void>.
     * @returns This Bunzai instance.
     */
    delete(path: string, handler: Handler): this;
    /**
     * Adds a route that responds to HEAD requests.
     *
     * @param path The path for the route. Must be a string.
     * @param handler The handler for the route. Must be a function that takes a Context and a Next as arguments and returns a Promise<void>.
     * @returns The current instance of Bunzai.
     */
    head(path: string, handler: Handler): this;
    /**
     * Registers an OPTIONS route.
     * @param path The path of the route. Must be a string.
     * @param handler The handler for the route. Must be a function that takes a Context and a Next as arguments and returns a Promise<void>.
     * @returns The App instance.
     */
    options(path: string, handler: Handler): this;
    /**
     * Start the server.
     * @param port - The port to listen on. Defaults to 3000.
     * @param hostname - The hostname to listen on. Defaults to localhost.
     * @returns A promise that resolves to an object with the port and hostname of the server.
     * @throws {Error} If the server fails to start.
     *
     * @example
     * ```ts
     * const bunzai = new Bunzai()
     *
     * await bunzai.listen()
     * await bunzai.listen(8080, '0.0.0.0')
     * ```
     */
    listen(port?: number, hostname?: string): Promise<{
        port: number;
        hostname: string;
    }>;
}
export {};
