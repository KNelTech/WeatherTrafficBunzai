import type { Context, Handler, Route, HTTPMethod, Middleware, RouterStrategyType } from './types';
export declare class Router {
    private strategy;
    private cache;
    constructor();
    addRoute(method: HTTPMethod, path: string, handler: Handler, middleware?: Middleware[], strategy?: RouterStrategyType): this;
    handleRequest(path: string, method: HTTPMethod, context: Context): Promise<Response | undefined>;
    getRoutes(): Route[];
}
export default Router;
