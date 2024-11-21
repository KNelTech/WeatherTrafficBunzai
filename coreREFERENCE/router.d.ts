import type { Context as ContextType, Handler, Route, HTTPMethod, Middleware, IRouter } from './types';
declare class Router implements IRouter {
    private root;
    private routeCache;
    private regexCache;
    constructor();
    private parseRegexRoute;
    private createRoute;
    addRoute(method: HTTPMethod, path: string, handler: Handler, middleware?: Middleware[]): IRouter;
    findRoute(method: HTTPMethod, path: string): {
        route: Route;
        params: Map<string, string>;
    } | undefined;
    getRoutes(): Route[];
    handleRequest(path: string, method: HTTPMethod, context: ContextType): Promise<Response | undefined>;
    private ensureChildNode;
    private runMiddlewareAndHandler;
    private processHandlerResult;
    private isHtml;
}
export { Router };
