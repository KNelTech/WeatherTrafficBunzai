import Bun from 'bun';
import type { JSXChild, JSXComponent, JSXElement, JSXElementType, JSXResult, JSXProps } from './types';
declare class BunzaiTranspiler {
    private readonly transpiler;
    private readonly componentCache;
    private readonly propsCache;
    private readonly renderCache;
    private readonly eventHandlers;
    private readonly childrenCache;
    private static readonly VOID_ELEMENTS;
    static readonly EMPTY_RESULT: string;
    constructor(options?: Bun.TranspilerOptions);
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
