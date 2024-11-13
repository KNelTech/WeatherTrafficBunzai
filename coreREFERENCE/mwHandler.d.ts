import type { Context, Middleware, MiddlewareTiming } from './types';
interface MiddlewareHandlerType {
    use(pathOrMiddleware: string | Middleware, ...middlewares: (Middleware | MiddlewareTiming)[]): this;
    group(...middlewares: Middleware[]): Middleware;
    useWhen(condition: (c: Context) => boolean, ...middlewares: Middleware[]): this;
}
declare class MiddlewareHandler implements MiddlewareHandlerType {
    private readonly preRoutingMiddlewares;
    private readonly postRoutingMiddlewares;
    runPreRoutingMiddlewares(c: Context): Promise<void>;
    runPostRoutingMiddlewares(c: Context): Promise<void>;
    use(pathOrMiddleware: string | Middleware, ...middlewares: (Middleware | MiddlewareTiming)[]): this;
    private addMiddleware;
    group(...middlewares: Middleware[]): Middleware;
    useWhen(condition: (c: Context) => boolean, ...middlewares: Middleware[]): this;
    private createNext;
    getMiddlewares(type?: 'pre' | 'post'): Array<{
        path: string;
        handler: Middleware;
    }>;
    private runMiddlewares;
}
export { MiddlewareHandler, type MiddlewareTiming };
