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

const DISABLED_EXTENSIONS_KEY = 'disabledExtensions';

export const store = createVanilla(
    combine(
        {
            fileSize: 0,
            fileName: '',
            fileExt: '',
            fileUrl: '',
            fileContent: null as string | ArrayBuffer | null,
            plugins: [
                new IFramePlugin(),
                new XLSXPlugin(),
                new SVGPlugin(),
                new MarkdownPlugin(),
                new ModelViewerPlugin(),
                new SyntaxPlugin(),
                // new JupyterNBPlugin(), // notebookjs + deps is large; notebooksjs not working with vite
            ],
            showConfig: false,
            disabledExtensions: {} as {
                [ext: string]: { [pluginShortName: string]: boolean };
            },
        },
        set => ({
            actions: {
                // TODO: embedded to use QL config to store, otherwise localStorage
                init: () => {
                    set((state) => {
                        const de = window.localStorage.getItem(
                            DISABLED_EXTENSIONS_KEY,
                        );
                        if (de) {
                            return { disabledExtensions: JSON.parse(de) };
                        }
                        return { disabledExtensions: state.disabledExtensions };
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
                        const newde = { ...state.disabledExtensions };
                        if (newde[ext] && newde[ext][pluginShortName]) {
                            delete newde[ext][pluginShortName];
                        } else {
                            if (!newde[ext]) {
                                newde[ext] = {};
                            }
                            newde[ext][pluginShortName] = true;
                        }
                        window.localStorage.setItem(
                            DISABLED_EXTENSIONS_KEY,
                            JSON.stringify(newde),
                        );
                        return { disabledExtensions: newde };
                    });
                },
            },
        }),
    ),
);

const useStore = create(store);

export default useStore;
