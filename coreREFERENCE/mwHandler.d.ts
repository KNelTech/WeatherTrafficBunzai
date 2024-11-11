import type { Context, Middleware, Next } from './types';
interface MiddlewareHandlerType {
    use(pathOrMiddleware: string | Middleware, ...middlewares: Middleware[]): this;
    group(...middlewares: Middleware[]): Middleware;
    useWhen(condition: (c: Context) => boolean, ...middlewares: Middleware[]): this;
}
export declare class MiddlewareHandler implements MiddlewareHandlerType {
    private readonly middlewares;
    use(pathOrMiddleware: string | Middleware, ...middlewares: Middleware[]): this;
    group(...middlewares: Middleware[]): Middleware;
    useWhen(condition: (c: Context) => boolean, ...middlewares: Middleware[]): this;
    createNext(c: Context): Next;
    getMiddlewares(): Array<{
        path: string;
        handler: Middleware;
    }>;
    runMiddlewares(c: Context): Promise<void>;
}
export {};
