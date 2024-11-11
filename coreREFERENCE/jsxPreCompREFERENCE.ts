import Bun from 'bun'
import type { JSXChild, JSXComponent, JSXElement, JSXElementType, JSXResult } from './types'

export class BunzaiTranspiler {
  private transpiler: Bun.Transpiler
  private cachedComponents = new WeakMap<Function, JSXComponent<any>>()
  private propsCache = new WeakMap<Record<string, unknown>, string>()
  private static readonly EMPTY_RESULT = ''
  private static readonly VOID_ELEMENTS = new Set([
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr'
  ])

  constructor(options?: Bun.TranspilerOptions) {
    this.transpiler = new Bun.Transpiler({
      loader: 'jsx',
      target: 'browser',
      minifyWhitespace: true,
      ...options
    })
  }

  renderJSX(element: JSXElement): JSXResult {
    try {
      if (typeof element.type === 'function') {
        return this.renderComponent(
          element.type as JSXComponent<JSXElement['props'] & { children?: JSXChild[] }>,
          {
            ...element.props,
            children: element.children
          }
        )
      }
      return this.jsx(element.type as string, element.props, ...element.children)
    } catch {
      return BunzaiTranspiler.EMPTY_RESULT
    }
  }

  private renderComponent<P extends Record<string, unknown>>(
    component: JSXComponent<P>,
    props: P & { children?: JSXChild[] }
  ): JSXResult {
    try {
      return component(props)
    } catch {
      return BunzaiTranspiler.EMPTY_RESULT
    }
  }

  createComponent<P extends Record<string, unknown>>(component: JSXComponent<P>): JSXComponent<P> {
    const cached = this.cachedComponents.get(component)
    if (cached) return cached as JSXComponent<P>

    const wrappedComponent = ((props: P & { children?: JSXChild[] }) =>
      this.renderComponent(component, props)) as JSXComponent<P>

    this.cachedComponents.set(component, wrappedComponent)
    return wrappedComponent
  }

  private transpileJSX(code: string): string {
    try {
      return this.transpiler.transformSync(code)
    } catch {
      throw new Error('JSX transpilation failed')
    }
  }

  private propsToString(props: Record<string, unknown> | null): string {
    if (!props) return BunzaiTranspiler.EMPTY_RESULT

    const cached = this.propsCache.get(props)
    if (cached) return cached

    const propsString = Object.entries(props)
      .filter(([_, value]) => value != null)
      .map(([key, value]) => ` ${key}={${JSON.stringify(value)}}`)
      .join('')

    this.propsCache.set(props, propsString)
    return propsString
  }

  private flattenChildren(children: (JSXChild | JSXChild[])[]): JSXChild[] {
    return children.flat().filter(Boolean)
  }

  jsx = (
    type: JSXElementType,
    props: Record<string, unknown> | null,
    ...children: (JSXChild | JSXChild[])[]
  ): JSXResult => {
    try {
      if (typeof type === 'function') {
        return this.renderComponent(type, {
          ...props,
          children: this.flattenChildren(children)
        } as any)
      }

      const flattenedChildren = this.flattenChildren(children)
      const isVoidElement = typeof type === 'string' && BunzaiTranspiler.VOID_ELEMENTS.has(type)

      const jsxCode = isVoidElement
        ? `<${type}${this.propsToString(props)} />`
        : `<${type}${this.propsToString(props)}>${flattenedChildren.join('')}</${type}>`

      return this.transpileJSX(jsxCode)
    } catch {
      return BunzaiTranspiler.EMPTY_RESULT
    }
  }
}
