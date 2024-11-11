import type { Context as ContextType, Next } from './types';
interface StaticOptions {
    spa?: boolean;
    index?: string;
    maxAge?: number;
    immutable?: boolean;
}
export declare function staticHandler(baseDir: string, path: string, staticDir: string, options?: StaticOptions): (c: ContextType, next: Next) => Promise<void>;
export {};
