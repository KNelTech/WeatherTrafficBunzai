import type { Context, Handler, Route, HTTPMethod, RouterStrategy, Middleware, RouterStrategyType } from './types';
export default class HybridRouter implements RouterStrategy {
    private root;
    private regexRoutes;
    private createRoute;
    private ensureChildNode;
    addRoute(method: HTTPMethod, path: string, handler: Handler, middleware: Middleware[] | undefined, strategy: RouterStrategyType): void;
    private addRegexRoute;
    private addTrieRoute;
    findRoute(method: HTTPMethod, path: string, strategy: RouterStrategyType): {
        route: Route;
        params: Record<string, string>;
    } | undefined;
    private findTrieRoute;
    private findRegexRoute;
    handleRequest(path: string, method: HTTPMethod, context: Context, strategy: RouterStrategyType): Promise<Response | undefined>;
    getRoutes(): Route[];
    private getAllTrieRoutes;
}
