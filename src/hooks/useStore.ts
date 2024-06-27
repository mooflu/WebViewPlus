import { create } from 'zustand';
import { createStore } from 'zustand/vanilla';
import { combine, persist } from 'zustand/middleware';

import { IPlugin, ViewerType } from '@plugins/PluginInterface';
import { SyntaxPlugin } from '@plugins/SyntaxPlugin';
import { XLSXPlugin } from '@plugins/XLSXPlugin';
import { SVGPlugin } from '@plugins/SVGPlugin';
import { IFramePlugin } from '@plugins/IFramePlugin';
import { MarkdownPlugin } from '@plugins/MarkdownPlugin';
import { ModelViewerPlugin } from '@plugins/ModelViewerPlugin';
import { ImagePlugin } from '@plugins/ImagePlugin';
import { JupyterNBPlugin } from '@plugins/JupyterNBPlugin';
import { FontPlugin } from '@plugins/FontPlugin';
import { IWebView2 } from '@utils/webview2Helpers';
import { ImageRendering, ZoomBehaviour } from '@utils/types';

const PLUGIN_SETTINGS_KEY = 'pluginSettings';
const PLUGIN_EXTRA_SETTINGS_KEY = 'pluginExtraSettings';

export const DEFAULT_FONTTEXT = 'The quick brown fox jumps over the lazy dog';
export const DEFAULT_SYNTAX_FONTSIZE = 13;

const PLUGINS = [
    new IFramePlugin(),
    new SVGPlugin(),
    new ImagePlugin(),
    new MarkdownPlugin(),
    new XLSXPlugin(),
    new ModelViewerPlugin(),
    new SyntaxPlugin(),
    new JupyterNBPlugin(),
    new FontPlugin(),
];

interface PluginSettings {
    shortName: string;
    enabled: boolean;
    extensions: { [index: string]: boolean };
    extraExtensions: string[];
}

interface TOCItem {
    level: number;
    id: string;
    title: string;
}

interface FileData {
    fileSize: number;
    fileName: string;
    fileExt: string;
    fileUrl: string;
    fileContent: string | ArrayBuffer | null;
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

export const store = createStore(
    persist(
        combine(
            {
                webview: (window as any).chrome?.webview as IWebView2 | undefined,

                fileSize: 0,
                fileName: '',
                fileExt: '',
                fileUrl: '',
                fileContent: null as string | ArrayBuffer | null,
                mdTableOfContentsItems: [] as TOCItem[],

                activeViewer: ViewerType.Unknown,
                showSettings: false as boolean,
                plugins: PLUGINS as IPlugin[],
                pluginByShortName: Object.fromEntries(PLUGINS.map(x => [x.shortName, x])),
                yingYang: true as boolean,

                openExifPanel: false,
                zoom: 1,

                // values below are stored in localstorage (see partialize below)
                // image plugin
                imageRendering: ImageRendering.Auto,
                newImageZoomBehaviour: ZoomBehaviour.ZoomToFit,
                resizeImageZoomBehaviour: ZoomBehaviour.KeepZoom,
                // font plugin
                fontText: DEFAULT_FONTTEXT,
                // syntax highlight plugin
                syntaxShowLineNumbers: true,
                syntaxWrapLines: false,
                syntaxFontSize: DEFAULT_SYNTAX_FONTSIZE,
                syntaxCustomFont: '',
                // detect text file encoding
                detectEncoding: false,
                // advanced QL settings from https://github.com/QL-Win/QuickLook/wiki/Advanced-configurations
                showTrayIcon: true,
                useTransparency: true,
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
                                mdTableOfContentsItems: [],
                                activeViewer: ViewerType.Unknown,
                            };
                        });
                    },
                    updateFileData: (fileData: FileData) => {
                        set((state) => {
                            return {
                                ...fileData,
                                activeViewer: ViewerType.Unknown,
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
                    setActiveViewer: (viewer: ViewerType) => {
                        set((state) => {
                            return { activeViewer: viewer };
                        });
                    },
                    savePluginSettings: () => {
                        const state = store.getState();
                        savePluginSettings(state.plugins);
                        state.webview?.postMessage({ command: 'Extensions', data: getEnabledExtensions() });
                        return {};
                    },
                    clearTableOfContent: () => {
                        set((state) => {
                            return { mdTableOfContentsItems: [] };
                        });
                    },
                    addTableOfContentItem: (t: TOCItem) => {
                        set((state) => {
                            return { mdTableOfContentsItems: [...state.mdTableOfContentsItems, t] };
                        });
                    },
                    togglePixelated: () => {
                        set((state) => {
                            const pixelated = state.imageRendering === ImageRendering.Pixelated;
                            return { imageRendering: (!pixelated) ? ImageRendering.Pixelated : ImageRendering.Auto };
                        });
                    },
                    setNewImageZoomBehaviour: (newImageZoomBehaviour: ZoomBehaviour) => {
                        set((state) => {
                            return { newImageZoomBehaviour };
                        });
                    },
                    setResizeImageZoomBehaviour: (resizeImageZoomBehaviour: ZoomBehaviour) => {
                        set((state) => {
                            return { resizeImageZoomBehaviour };
                        });
                    },
                    setFontText: (fontText: string) => {
                        set((state) => {
                            return { fontText };
                        });
                    },
                    toggleSyntaxShowLineNumbers: () => {
                        set((state) => {
                            return { syntaxShowLineNumbers: !state.syntaxShowLineNumbers };
                        });
                    },
                    toggleSyntaxWrapLines: () => {
                        set((state) => {
                            return { syntaxWrapLines: !state.syntaxWrapLines };
                        });
                    },
                    setSyntaxFontSize: (syntaxFontSize: number) => {
                        set((state) => {
                            return { syntaxFontSize };
                        });
                    },
                    setSyntaxCustomFont: (syntaxCustomFont: string) => {
                        set((state) => {
                            return { syntaxCustomFont };
                        });
                    },
                    setDetectEncoding: (detectEncoding: boolean, options = { init: false }) => {
                        set((state) => {
                            if (!options.init) {
                                state.webview?.postMessage({ command: 'DetectEncoding', boolValue: detectEncoding });
                            }
                            return { detectEncoding };
                        });
                    },
                    setShowTrayIcon: (showTrayIcon: boolean, options = { init: false }) => {
                        set((state) => {
                            if (!options.init) {
                                state.webview?.postMessage({ command: 'ShowTrayIcon', boolValue: showTrayIcon });
                            }
                            return { showTrayIcon };
                        });
                    },
                    setUseTransparency: (useTransparency: boolean, options = { init: false }) => {
                        set((state) => {
                            if (!options.init) {
                                state.webview?.postMessage({ command: 'UseTransparency', boolValue: useTransparency });
                            }
                            return { useTransparency };
                        });
                    },
                    restartQuickLook: () => {
                        set((state) => {
                            state.webview?.postMessage({ command: 'Restart', boolValue: true });
                            return {};
                        });
                    },
                },
            }),
        ),
        {
            name: PLUGIN_EXTRA_SETTINGS_KEY,
            partialize: state => ({
                imageRendering: state.imageRendering,
                newImageZoomBehaviour: state.newImageZoomBehaviour,
                resizeImageZoomBehaviour: state.resizeImageZoomBehaviour,
                fontText: state.fontText,
                syntaxShowLineNumbers: state.syntaxShowLineNumbers,
                syntaxWrapLines: state.syntaxWrapLines,
                syntaxFontSize: state.syntaxFontSize,
                syntaxCustomFont: state.syntaxCustomFont,
                detectEncoding: state.detectEncoding,
                showTrayIcon: state.showTrayIcon,
                useTransparency: state.useTransparency,
            }),
        },
    ),
);

const useStore = create(store);

export default useStore;
