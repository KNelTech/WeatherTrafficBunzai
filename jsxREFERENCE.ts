import Bun from 'bun'
import { Fragment, JSXRenderError } from './types'
import type {
  JSXChild,
  JSXComponent,
  JSXElement,
  JSXElementType,
  JSXResult,
  JSXProps
} from './types'

class BunzaiTranspiler {
  private readonly transpiler: Bun.Transpiler
  private readonly componentCache = new Map<Function, JSXComponent<any>>()
  private readonly propsCache = new Map<string, string>()
  private readonly renderCache = new Map<string, string>()
  private readonly eventHandlers = new Map<string, Function>()
  private readonly childrenCache = new Map<(JSXChild | JSXChild[])[], JSXChild[]>()

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
  static readonly EMPTY_RESULT: string = ''

  constructor(options?: Bun.TranspilerOptions) {
    this.transpiler = new Bun.Transpiler({
      loader: 'jsx',
      target: 'browser',
      minifyWhitespace: true,
      ...options
    })
  }

  private handleEvent<T extends Function>(
    eventName: string,
    handler: T,
    componentId?: string
  ): string {
    const eventId = `${componentId || ''}_${eventName}_${Bun.randomUUIDv7()}`
    this.eventHandlers.set(eventId, handler)
    return `data-bunzai-event="${eventId}" data-event-type="${eventName}"`
  }

  private escapeHtml(text: string): string {
    const htmlEscapes: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }
    return text.replace(/[&<>"']/g, (char) => htmlEscapes[char])
  }

  private serializeProps(props: JSXProps | null): string {
    if (!props) return BunzaiTranspiler.EMPTY_RESULT

    const propsKey = JSON.stringify(props)
    const cachedResult = this.propsCache.get(propsKey)
    if (cachedResult) return cachedResult

    const serialized = Object.entries(props)
      .filter(([_, value]) => value != null)
      .map(([key, value]) => {
        if (typeof value === 'function' && key.startsWith('on')) {
          return this.handleEvent(key.slice(2).toLowerCase(), value as Function)
        }

        if (key === 'className') key = 'class'
        if (key === 'htmlFor') key = 'for'

        const valueString =
          typeof value === 'string'
            ? `"${this.escapeHtml(value)}"`
            : typeof value === 'boolean' && value
              ? key
              : `"${this.escapeHtml(String(value))}"`

        return ` ${key}=${valueString}`
      })
      .join('')

    this.propsCache.set(propsKey, serialized)
    return serialized
  }

  private renderComponent<P extends JSXProps>(
    component: JSXComponent<P>,
    props: P & { children?: JSXChild[] }
  ): JSXResult {
    try {
      const cacheKey = JSON.stringify({ component: component.name, props })
      const cached = this.renderCache.get(cacheKey)
      if (cached) return cached

      const result = component(props)
      this.renderCache.set(cacheKey, result)
      return result
    } catch (error) {
      throw new JSXRenderError(
        `Error rendering component: ${error instanceof Error ? error.message : String(error)}`,
        component.displayName || component.name
      )
    }
  }

  private transpileJSX(code: string): string {
    try {
      return this.transpiler.transformSync(code)
    } catch (error) {
      console.error('JSX transpilation failed:', error)
      throw error
    }
  }

  private flattenChildren = (children: (JSXChild | JSXChild[])[]): JSXChild[] => {
    const cachedResult = this.childrenCache.get(children)
    if (cachedResult) return cachedResult

    const flattened = children.flat().filter(Boolean)
    this.childrenCache.set(children, flattened)
    return flattened
  }

  private renderChildren(children: JSXChild[]): string {
    return children
      .flat()
      .filter((child) => child != null)
      .map((child) => {
        if (typeof child === 'string') return this.escapeHtml(child)
        if (typeof child === 'number') return String(child)
        if (Array.isArray(child)) return this.renderChildren(child)
        if (typeof child === 'object' && child !== null) {
          return this.renderJSX(child as JSXElement)
        }
        return ''
      })
      .join('')
  }

  public renderJSX(element: JSXElement): JSXResult {
    try {
      if (element.type === Fragment) {
        return this.renderChildren(element.children)
      }

      if (typeof element.type === 'string') {
        return this.jsx(element.type, element.props, ...element.children)
      }

      if (typeof element.type === 'function') {
        return this.renderComponent(element.type, {
          ...element.props,
          children: element.children
        })
      }

      throw new JSXRenderError(`Unsupported element type: ${String(element.type)}`)
    } catch (error) {
      if (error instanceof JSXRenderError) throw error
      throw new JSXRenderError(`Render failed: ${String(error)}`)
    }
  }

  public createComponent<P extends JSXProps>(
    component: JSXComponent<P>
  ): JSXComponent<P & { children?: JSXChild[] }> {
    const cached = this.componentCache.get(component)
    if (cached) return cached as JSXComponent<P & { children?: JSXChild[] }>

    const wrappedComponent: JSXComponent<P & { children?: JSXChild[] }> = (props) => {
      try {
        return this.renderComponent(component, props)
      } catch (error) {
        throw new JSXRenderError(
          `Component creation failed: ${String(error)}`,
          component.displayName || component.name
        )
      }
    }
    wrappedComponent.displayName = component.displayName || component.name

    this.componentCache.set(component, wrappedComponent)
    return wrappedComponent
  }

  public jsx = <P extends JSXProps>(
    type: JSXElementType,
    props: P | null,
    ...children: (JSXChild | JSXChild[])[]
  ): JSXResult => {
    try {
      const flatChildren = this.flattenChildren(children)

      if (type === Fragment) {
        return this.renderChildren(flatChildren)
      }

      if (typeof type === 'function') {
        return this.renderComponent(
          type as JSXComponent,
          {
            ...props,
            children: flatChildren
          } as P & { children?: JSXChild[] }
        )
      }

      if (typeof type === 'object' && type !== null) {
        return this.renderJSX(type as JSXElement)
      }

      if (typeof type === 'string') {
        const isVoid = BunzaiTranspiler.VOID_ELEMENTS.has(type)
        const rawJSX = isVoid
          ? `<${type}${this.serializeProps(props)}/>`
          : `<${type}${this.serializeProps(props)}>${this.renderChildren(flatChildren)}</${type}>`
        return this.transpileJSX(rawJSX)
      }

      throw new JSXRenderError(`Invalid JSX element type: ${String(type)}`)
    } catch (error) {
      if (error instanceof JSXRenderError) throw error
      throw new JSXRenderError(`JSX transformation failed: ${String(error)}`)
    }
  }

  public clearCaches(): void {
    this.componentCache.clear()
    this.propsCache.clear()
    this.renderCache.clear()
    this.eventHandlers.clear()
  }

  public getEventHandler(eventId: string): Function | undefined {
    return this.eventHandlers.get(eventId)
  }
}

export { BunzaiTranspiler }
