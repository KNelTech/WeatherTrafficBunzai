import type { Context as ContextType } from './types';
interface StaticOptions {
    spa?: boolean;
    index?: string;
    maxAge?: number;
    immutable?: boolean;
    cacheControl?: string;
}
declare class StaticHandler {
    private fullStaticPath;
    private basePath;
    private spa;
    private index;
    private cacheControl;
    private responseUtils;
    constructor(baseDir: string, basePath: string, staticDir: string, options?: StaticOptions);
    private generateCacheControl;
    private createFileStream;
    private getFilePath;
    handle(c: ContextType): Promise<Response | undefined>;
}
export { StaticHandler, type StaticOptions };
