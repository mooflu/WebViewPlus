import { log } from '@utils/log';
import { store } from '@hooks/useStore';

export function initWebview2() {
    const ext2Mime: { [index: string]: string } = {
        pdf: 'application/pdf',
        webp: 'image/webp',
    };

    (window as any).WebviewPlus = {
        openFile: async (fileName: string, fileSize: number) => {
            log(`openFile: "${fileName}" ${fileSize}`);
            const fileExt =
                fileName.split('.').pop()?.toLocaleLowerCase() || '';

            const fileContent = await (window as any).chrome.webview.hostObjects
                .fileProps.Contents;
            const binFileContent = await (window as any).chrome.webview
                .hostObjects.fileProps.BinContents;

            log(`openFile: init url data START`);
            let blob: Blob;
            if (fileContent) {
                blob = new Blob([fileContent], { type: 'text/html' });
            } else {
                let mimeType = ext2Mime[fileExt]
                    ? ext2Mime[fileExt]
                    : 'application/octet-stream';
                blob = new Blob([new Uint8Array(binFileContent).buffer], {
                    type: mimeType,
                });
            }
            const fileUrl = URL.createObjectURL(blob); // returns a blob url - won't expose local file system location
            log(`openFile: init url data END`);

            store.setState({
                fileSize,
                fileContent: fileContent || binFileContent,
                fileName,
                fileExt,
                fileUrl,
            });

            const extensions = (window as any).WebviewPlus.getExtensions().join(
                ','
            );
            (window as any).chrome.webview.hostObjects.fileProps.extensions = extensions;
        },
        getExtensions: () => {
            const { plugins, disabledExtensions } = store.getState();
            const extensions = new Set<string>();
            for (const p of plugins) {
                for (const fileExt of p.extensions.keys()) {
                    const isDisabled =
                        disabledExtensions[fileExt] &&
                        disabledExtensions[fileExt][p.shortName];

                    if (!isDisabled) {
                        extensions.add(fileExt);
                    }
                }
            }
            return [...extensions];
        },
    };
}
