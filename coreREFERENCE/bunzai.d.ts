import type { Middleware, Handler, App, Context as ContextType, RouteHandler, Plugin, PluginOptions } from './types';
interface StaticOptions {
    spa?: boolean;
    index?: string;
}
declare class Bunzai implements App {
    private readonly router;
    private readonly middlewareHandler;
    private readonly baseDir;
    private readonly plugins;
    private readonly installedPlugins;
    private namespaces;
    constructor();
    getInstalledPlugins(): Plugin[];
    getPluginDependencyGraph(): Record<string, string[]>;
    private addRoute;
    private handleRouteHandler;
    private createPluginAPI;
    private installPlugin;
    handleRequest(req: Request): Promise<Response>;
    static(path: string, staticDir: string, options?: StaticOptions): this;
    use(pathOrMiddleware: string | Middleware, ...middlewares: Middleware[]): this;
    plugin(plugin: Plugin, options?: PluginOptions): this;
    usePlugin(namespace: string): Record<string, Function>;
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
