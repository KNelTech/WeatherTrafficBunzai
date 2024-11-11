import type { Bunzai } from './bunzai';
interface TLSConfig {
    cert: string;
    key: string;
    ca?: string[];
}
export declare function listen(app: Bunzai, port?: number, hostname?: string, reusePort?: boolean, tls?: TLSConfig): Promise<{
    port: number;
    hostname: string;
}>;
export {};
