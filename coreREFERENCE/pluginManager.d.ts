import type { Plugin, PluginOptions, PluginDependency } from './types';
import { Bunzai } from './bunzai';
declare class PluginManager {
    private readonly app;
    private plugins;
    private namespaces;
    private dependencyGraphCache;
    private readonly pluginAPI;
    private currentInstallingPlugin;
    constructor(app: Bunzai);
    isPluginInstalled: (pluginName: string) => boolean;
    getInstalledPlugins: () => readonly Plugin[];
    getPluginDependencyGraph: () => Readonly<Record<string, readonly PluginDependency[]>>;
    getPluginMetadata: (pluginName: string) => Readonly<Plugin> | undefined;
    private invalidateDependencyGraphCache;
    private isVersionCompatible;
    private createPluginAPI;
    private registerNamespace;
    private installPlugin;
    private installDependencies;
    plugin(plugin: Plugin, options?: PluginOptions): Promise<void>;
    usePlugin: (namespace: string) => Record<string, Function>;
    uninstallPlugin(pluginName: string): Promise<void>;
    namespaceExists: (namespace: string) => boolean;
    isPluginRegistered: (pluginName: string) => boolean;
    getAllNamespaces: () => string[];
    getPluginNamespaces: (pluginName: string) => string[];
}
export { PluginManager };
