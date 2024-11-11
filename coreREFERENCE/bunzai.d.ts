import type { Middleware, Handler, App, Context as ContextType, RouteHandler } from './types';
interface StaticOptions {
    spa?: boolean;
    index?: string;
}
export declare class Bunzai implements App {
    private readonly router;
    private readonly middlewareHandler;
    private readonly baseDir;
    constructor();
    private addRoute;
    private handleRouteHandler;
    handleRequest(req: Request): Promise<Response>;
    static(path: string, staticDir: string, options?: StaticOptions): this;
    use(pathOrMiddleware: string | Middleware, ...middlewares: Middleware[]): this;
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
export default Bunzai;
