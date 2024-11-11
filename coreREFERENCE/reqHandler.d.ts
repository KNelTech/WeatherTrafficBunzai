import { Router } from './router';
import { MiddlewareHandler } from './mwHandler';
export declare function handleRequest(req: Request, router: Router, middlewareHandler: MiddlewareHandler): Promise<Response>;
