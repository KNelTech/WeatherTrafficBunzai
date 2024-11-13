import type { Context, Handler, Route, HTTPMethod, Middleware, RouterStrategyType } from './types';
declare class Router {
    private strategy;
    private cache;
    constructor();
    addRoute(method: HTTPMethod, path: string, handler: Handler, middleware?: Middleware[], strategy?: RouterStrategyType): this;
    handleRequest(path: string, method: HTTPMethod, context: Context): Promise<Response | undefined>;
    getRoutes(): Route[];
    private getCacheKey;
    private getCachedRoute;
    private findRoute;
    private cacheRoute;
    private handleRouteResult;
    private runMiddlewareAndHandler;
}
export { Router };
