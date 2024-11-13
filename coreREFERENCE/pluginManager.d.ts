import type { Plugin, PluginOptions, PluginDependency } from './types';
import { Bunzai } from './bunzai';
declare class PluginManager {
    private readonly app;
    private plugins;
    private installedPlugins;
    private namespaces;
    constructor(app: Bunzai);
    getInstalledPlugins(): readonly Plugin[];
    getPluginDependencyGraph(): Readonly<Record<string, readonly PluginDependency[]>>;
    getPluginMetadata(pluginName: string): Readonly<Plugin> | undefined;
    isPluginInstalled(pluginName: string): boolean;
    private isVersionCompatible;
    private createPluginAPI;
    private installPlugin;
    plugin(plugin: Plugin, options?: PluginOptions): Promise<void>;
    usePlugin(namespace: string): Record<string, Function>;
    uninstallPlugin(pluginName: string): Promise<void>;
}
export { PluginManager };
