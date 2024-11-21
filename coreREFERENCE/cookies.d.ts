import type { RequestUtils } from './request';
import type { ResponseUtils } from './response';
import type { CookieOptions, SigningOptions } from './types';
type SigningStrategy = (value: string, secret: string, options?: any) => string;
type VerifyStrategy = (value: string, secret: string) => string | null;
export declare class CookieManager {
    private readonly request;
    private readonly response;
    private parsedCookies;
    private signingStrategies;
    private verifyStrategies;
    constructor(request: RequestUtils, response: ResponseUtils);
    set(name: string, value: string, options?: CookieOptions & {
        signing?: SigningOptions;
    }): boolean;
    get(name: string, options?: {
        signing?: SigningOptions;
    }): string | null;
    delete(name: string, options?: Omit<CookieOptions, 'maxAge' | 'sameSite'>): boolean;
    registerSigningStrategy(type: string, strategy: SigningStrategy): void;
    registerVerifyStrategy(type: string, strategy: VerifyStrategy): void;
    private mergeOptions;
    private signValue;
    private verifyValue;
    private serialize;
    private setCookieHeader;
    private ensureParsedCookies;
    private parseCookies;
    private hmacSign;
    private hmacVerify;
}
export {};
