import { Router } from './router';
import { MiddlewareHandler } from './mwHandler';
import { StaticHandler } from './staticHandler';
export declare function handleRequest(req: Request, router: Router, middlewareHandler: MiddlewareHandler, staticHandlers: StaticHandler[]): Promise<Response>;
