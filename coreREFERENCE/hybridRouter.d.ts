import type { Context, Handler, Route, HTTPMethod, RouterStrategy, Middleware, RouterStrategyType } from './types';
declare class HybridRouter implements RouterStrategy {
    private root;
    private regexRoutes;
    private routeCache;
    private regexRoutesIndex;
    private createRoute;
    addRoute(method: HTTPMethod, path: string, handler: Handler, middleware: Middleware[] | undefined, strategy: RouterStrategyType): void;
    private addRegexRoute;
    private addTrieRoute;
    private ensureChildNode;
    findRoute(method: HTTPMethod, path: string, strategy: RouterStrategyType): {
        route: Route;
        params: Map<string, string>;
    } | undefined;
    private findTrieRoute;
    private findRegexRoute;
    handleRequest(path: string, method: HTTPMethod, context: Context, strategy: RouterStrategyType): Promise<Response | undefined>;
    getRoutes(): Route[];
}
export { HybridRouter };
