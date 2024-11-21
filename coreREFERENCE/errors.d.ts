import type { BunzaiErrorOptions, IBunzaiError, JsonObject, HttpStatus } from './types';
export declare class BunzaiError extends Error implements IBunzaiError {
    status: HttpStatus;
    code?: string;
    details?: JsonObject;
    constructor(options: BunzaiErrorOptions);
}
export declare const NotFoundError: {
    new (message?: string, details?: JsonObject): {
        status: HttpStatus;
        code?: string;
        details?: JsonObject;
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const BadRequestError: {
    new (message?: string, details?: JsonObject): {
        status: HttpStatus;
        code?: string;
        details?: JsonObject;
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const UnauthorizedError: {
    new (message?: string, details?: JsonObject): {
        status: HttpStatus;
        code?: string;
        details?: JsonObject;
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const ForbiddenError: {
    new (message?: string, details?: JsonObject): {
        status: HttpStatus;
        code?: string;
        details?: JsonObject;
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare function bunzaiCustomError(name: string, defaultMessage: string, status: HttpStatus, code: string): {
    new (message?: string, details?: JsonObject): {
        status: HttpStatus;
        code?: string;
        details?: JsonObject;
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare function isBunzaiError(error: unknown): error is BunzaiError;
export declare function toBunzaiError(error: unknown): BunzaiError;
