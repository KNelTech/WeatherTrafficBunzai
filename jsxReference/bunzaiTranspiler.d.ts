import Bun from 'bun';
type Primitive = string | number | boolean | null | undefined;
export type JSXChild = JSXElement | Primitive | JSXChild[];
export type JSXElementType = string | JSXComponent<any> | symbol | JSXFragment;
export declare const Fragment: unique symbol;
export interface JSXElement {
    type: JSXElementType;
    props: JSXProps;
    children: JSXChild[];
    key?: string | number;
}
export type JSXProps = Record<string, unknown>;
export type JSXResult = string;
export type JSXFragment = typeof Fragment;
export interface JSXComponent<P = JSXProps> {
    (props: P & {
        children?: JSXChild[];
    }): JSXResult;
    displayName?: string;
}
export declare class JSXRenderError extends Error {
    component?: string | undefined;
    constructor(message: string, component?: string | undefined);
}
declare class BunzaiTranspiler {
    private readonly transpiler;
    private readonly componentCache;
    private readonly propsCache;
    private readonly renderCache;
    private readonly eventHandlers;
    private readonly childrenCache;
    constructor(options?: Bun.TranspilerOptions);
    private static readonly EMPTY_RESULT;
    private static readonly VOID_ELEMENTS;
    private getCacheKey;
    private handleEvent;
    private escapeHtml;
    private serializeProps;
    private renderComponent;
    private transpileJSX;
    private flattenChildren;
    private renderChildren;
    renderJSX(element: JSXElement): JSXResult;
    createComponent<P extends JSXProps>(component: JSXComponent<P>): JSXComponent<P & {
        children?: JSXChild[];
    }>;
    jsx: <P extends JSXProps>(type: JSXElementType, props: P | null, ...children: (JSXChild | JSXChild[])[]) => JSXResult;
    clearCaches(): void;
    getEventHandler(eventId: string): Function | undefined;
}
export { BunzaiTranspiler };
