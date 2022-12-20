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

const PLUGIN_SETTINGS_KEY = 'pluginSettings';

const PLUGINS = [
    new IFramePlugin(),
    new XLSXPlugin(),
    new SVGPlugin(),
    new MarkdownPlugin(),
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

export const store = createVanilla(
    combine(
        {
            fileSize: 0,
            fileName: '',
            fileExt: '',
            fileUrl: '',
            fileContent: null as string | ArrayBuffer | null,
            plugins: PLUGINS,
            showConfig: false,
            pluginByShortName: Object.fromEntries(PLUGINS.map(x => [x.shortName, x])),
        },
        set => ({
            actions: {
                // TODO: embedded to use QL config to store, otherwise localStorage
                init: () => {
                    set((state) => {
                        const pluginSettings: PluginSettings[] = JSON.parse(
                            window.localStorage.getItem(PLUGIN_SETTINGS_KEY) || '[]',
                        );
                        for (const ps of pluginSettings) {
                            const p = state.pluginByShortName[ps.shortName];
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

                        return { plugins: [...state.plugins] };
                    });
                },
                togglePlugin: (p: IPlugin) => {
                    set((state) => {
                        p.enabled = !p.enabled;
                        savePluginSettings(state.plugins);
                        return { plugins: [...state.plugins] };
                    });
                },
                toggleExtension: (ext: string, pluginShortName: string) => {
                    set((state) => {
                        const p = state.pluginByShortName[pluginShortName];
                        if (ext in p.extensions) {
                            p.extensions[ext] = !p.extensions[ext];
                        }
                        savePluginSettings(state.plugins);
                        return { plugins: [...state.plugins] };
                    });
                },
            },
        }),
    ),
);

const useStore = create(store);

export default useStore;
