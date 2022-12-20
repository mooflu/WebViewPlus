import { store } from '@hooks/useStore';
import { log } from '@utils/log';

export interface IWebView2 {
    postMessage: (obj: any) => void;
    releaseBuffer: (buffer: ArrayBuffer) => void;
    addEventListener: (type: string, listener: (arg: any) => void) => void;
    removeEventListener: (type: string, listener: (arg: any) => void) => void;
    // hostObjects
    // postMessageWithAdditionalObjects
    // dispatchEvent
}

export const handleWebMessage = (e: MessageEvent & {data: string}) => {
    log(`Received handleWebMessage: ${e.data}`);
    if (e.data === 'unload') {
        store.setState({
            fileSize: 0,
            fileContent: null,
            fileName: '',
            fileExt: '',
            fileUrl: '',
        });
    }
};

const ext2Mime: { [index: string]: string } = {
    pdf: 'application/pdf',
    webp: 'image/webp',
};

export const handleSharedBufferReceived = (e: MessageEvent & {additionalData: any, getBuffer: any}) => {
    const binContent: ArrayBuffer = e.getBuffer();
    const fileName = e.additionalData.fileName;
    const fileSize = e.additionalData.fileSize;
    const isBinary = e.additionalData.isBinary;
    const textContent = e.additionalData.textContent;
    const fileExt = fileName.split('.').pop()?.toLocaleLowerCase() || '';
    log(`Received handleSharedBufferReceived: File=${fileName} Size=${fileSize}`);

    // fileUrl for iframed content (pdf, webp, html, etc.)
    let fileUrl = '';
    if (isBinary) {
        const mimeType = ext2Mime[fileExt]
            ? ext2Mime[fileExt]
            : 'application/octet-stream';
        const blob = new Blob([binContent], {
            type: mimeType,
        });
        fileUrl = URL.createObjectURL(blob);
    } else {
        const blob = new Blob([textContent], { type: 'text/html' });
        fileUrl = URL.createObjectURL(blob);
    }

    store.setState({
        fileSize,
        fileContent: isBinary ? binContent : textContent,
        fileName,
        fileExt,
        fileUrl,
    });
};
