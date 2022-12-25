import create from 'zustand';
import createVanilla from 'zustand/vanilla';
import { combine } from 'zustand/middleware';

import { IPlugin } from '@plugins/PluginInterface';
import { SyntaxPlugin } from '@plugins/SyntaxPlugin';
import { XLSXPlugin } from '@plugins/XLSXPlugin';
import { SVGPlugin } from '@plugins/SVGPlugin';
import { IFramePlugin } from '@plugins/IFramePlugin';
import { MarkdownPlugin } from '@plugins/MarkdownPlugin';
import { ModelViewerPlugin } from '@plugins/ModelViewerPlugin';
import { ImagePlugin } from '@plugins/ImagePlugin';
import { IWebView2 } from '@utils/webview2Helpers';

const PLUGIN_SETTINGS_KEY = 'pluginSettings';

const PLUGINS = [
    new IFramePlugin(),
    new SVGPlugin(),
    new ImagePlugin(),
    new MarkdownPlugin(),
    new XLSXPlugin(),
    new ModelViewerPlugin(),
    new SyntaxPlugin(),
    // new JupyterNBPlugin(), // notebookjs + deps is large; notebooksjs not working with vite
];

interface PluginSettings {
    shortName: string;
    enabled: boolean;
    extensions: { [index: string]: boolean };
    extraExtensions: string[];
}

const getEnabledExtensions = () => {
    const { plugins } = store.getState();
    const extensions = new Set<string>();
    for (const p of plugins) {
        if (!p.enabled) continue;

        for (const fileExt in p.extensions) {
            if (p.extensions[fileExt]) {
                extensions.add(fileExt);
            }
        }
        for (const fileExt of p.extraExtensions) {
            // for the syntax highlighter the file extension can
            // be followed by the language name. E.g. rs:rust
            const rawFileExt = fileExt.split(':')[0];
            extensions.add(rawFileExt);
        }
    }
    return [...extensions];
};

const savePluginSettings = (plugins: IPlugin[]) => {
    const pluginSettings: PluginSettings[] = [];
    for (const p of plugins) {
        pluginSettings.push({
            shortName: p.shortName,
            enabled: p.enabled,
            extraExtensions: p.extraExtensions,
            extensions: p.extensions,
        });
    }
    window.localStorage.setItem(
        PLUGIN_SETTINGS_KEY,
        JSON.stringify(pluginSettings),
    );
};

const loadPluginSettings = () => {
    const { pluginByShortName } = store.getState();

    const pluginSettings: PluginSettings[] = JSON.parse(
        window.localStorage.getItem(PLUGIN_SETTINGS_KEY) || '[]',
    );
    for (const ps of pluginSettings) {
        const p = pluginByShortName[ps.shortName];
        if (p) {
            p.enabled = ps.enabled;
            p.extraExtensions = ps.extraExtensions;
            for (const ext in ps.extensions) {
                if (ext in p.extensions) {
                    p.extensions[ext] = ps.extensions[ext];
                }
            }
        }
    }
};

export const store = createVanilla(
    combine(
        {
            webview: (window as any).chrome?.webview as IWebView2 | undefined,
            fileSize: 0,
            fileName: '',
            fileExt: '',
            fileUrl: '',
            fileContent: null as string | ArrayBuffer | null,
            plugins: PLUGINS as IPlugin[],
            showConfig: false as boolean,
            pluginByShortName: Object.fromEntries(PLUGINS.map(x => [x.shortName, x])),
        },
        set => ({
            actions: {
                init: () => {
                    set((state) => {
                        loadPluginSettings();
                        state.webview?.postMessage({ command: 'Extensions', data: getEnabledExtensions() });
                        return { plugins: [...state.plugins] };
                    });
                },
                unload: () => {
                    set(() => {
                        return {
                            fileSize: 0,
                            fileContent: null,
                            fileName: '',
                            fileExt: '',
                            fileUrl: '',
                        };
                    });
                },
                togglePlugin: (p: IPlugin) => {
                    set((state) => {
                        p.enabled = !p.enabled;
                        return { plugins: [...state.plugins] };
                    });
                },
                toggleExtension: (ext: string, pluginShortName: string) => {
                    set((state) => {
                        const p = state.pluginByShortName[pluginShortName];
                        if (ext in p.extensions) {
                            p.extensions[ext] = !p.extensions[ext];
                        }
                        return { plugins: [...state.plugins] };
                    });
                },
                setExtraExtensions: (extensions: string[], pluginShortName: string) => {
                    set((state) => {
                        const p = state.pluginByShortName[pluginShortName];
                        p.extraExtensions = extensions;
                        return { plugins: [...state.plugins] };
                    });
                },
                savePluginSettings: () => {
                    const state = store.getState();
                    savePluginSettings(state.plugins);
                    state.webview?.postMessage({ command: 'Extensions', data: getEnabledExtensions() });
                    return {};
                },
            },
        }),
    ),
);

const useStore = create(store);

export default useStore;
