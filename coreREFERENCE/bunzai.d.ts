import type { StaticOptions } from './staticHandler';
import type { Middleware, MiddlewareTiming, Handler, App, Context as ContextType, RouteHandler, Plugin, PluginOptions } from './types';
declare class Bunzai implements App {
    private readonly router;
    private readonly baseDir;
    private staticHandlers;
    private readonly pluginManager;
    private readonly middlewareHandler;
    constructor();
    private addRoute;
    private handleRouteHandler;
    handleRequest(req: Request): Promise<Response>;
    plugin(plugin: Plugin, options?: PluginOptions): Promise<this>;
    usePlugin(namespace: string): Record<string, Function>;
    static(path: string, staticDir: string, options?: StaticOptions): this;
    use(pathOrMiddleware: string | Middleware, ...middlewares: (Middleware | MiddlewareTiming)[]): this;
    group(...middlewares: Middleware[]): Middleware;
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
export { Bunzai };
