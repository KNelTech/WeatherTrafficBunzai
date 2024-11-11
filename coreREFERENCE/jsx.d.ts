import Bun from 'bun';
import type { JSXChild, JSXComponent, JSXElement, JSXElementType, JSXResult } from './types';
export declare class BunzaiTranspiler {
    private transpiler;
    private cachedComponents;
    private propsCache;
    private static readonly EMPTY_RESULT;
    private static readonly VOID_ELEMENTS;
    constructor(options?: Bun.TranspilerOptions);
    renderJSX(element: JSXElement): JSXResult;
    private renderComponent;
    createComponent<P extends Record<string, unknown>>(component: JSXComponent<P>): JSXComponent<P>;
    private transpileJSX;
    private propsToString;
    private flattenChildren;
    jsx: (type: JSXElementType, props: Record<string, unknown> | null, ...children: (JSXChild | JSXChild[])[]) => JSXResult;
}
