import type { Plugin } from '../../core/types';
import type { JSXElement, JSXComponent, JSXProps, JSXChild, JSXElementType, JSXResult } from './bunzaiTranspiler';
declare module '../../core/types' {
    interface ContextExtensions {
        renderJSX(element: JSXElement): JSXResult;
        createComponent<P extends JSXProps>(component: JSXComponent<P>): JSXComponent<P & {
            children?: JSXChild[];
        }>;
        jsx(type: JSXElementType, props: JSXProps | null, ...children: JSXChild[]): Response;
    }
}
export declare function jsxPlugin(): Plugin;
