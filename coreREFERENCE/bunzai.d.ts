import type { App, BunzaiConfig, Context as ContextType, Handler, Middleware, MiddlewareTiming, Plugin, PluginOptions, RouteHandler } from './types';
export declare class Bunzai implements App {
    private readonly router;
    private readonly pluginManager;
    private readonly middlewareHandler;
    constructor(config?: BunzaiConfig);
    private addRoute;
    private handleRouteHandler;
    handleRequest(req: Request): Promise<Response>;
    plugin(plugin: Plugin, options?: PluginOptions): this;
    usePlugin(namespace: string): Record<string, Function>;
    use(pathOrMiddleware: string | Middleware, ...middlewares: (Middleware | MiddlewareTiming)[]): this;
    useWhen(condition: (c: ContextType) => boolean, ...middlewares: Middleware[]): this;
    route(basePath: string, ...subApps: Bunzai[]): this;
    routeHandler(routeHandlers: RouteHandler): this;
    get(path: string, ...handlers: (Handler | Middleware)[]): this;
    post(path: string, ...handlers: (Handler | Middleware)[]): this;
    put(path: string, ...handlers: (Handler | Middleware)[]): this;
    patch(path: string, ...handlers: (Handler | Middleware)[]): this;
    delete(path: string, ...handlers: (Handler | Middleware)[]): this;
    head(path: string, ...handlers: (Handler | Middleware)[]): this;
    options(path: string, ...handlers: (Handler | Middleware)[]): this;
    listen(port?: number, hostname?: string, reusePort?: boolean, tls?: {
        cert: string;
        key: string;
        ca?: string[];
    }): Promise<{
        port: number;
        hostname: string;
    }>;
}
