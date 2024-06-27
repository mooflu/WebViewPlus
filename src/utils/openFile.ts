import useStore from '@hooks/useStore';
import { log } from '@utils/log';

// These should match the ones in the QL plugin WebpagePanel._binExtensions
const BINARY_EXTENSIONS = new Set([
    // tabular
    'xlsx',
    'xls',
    'ods',
    // 3d model
    'gltf',
    'glb',
    'obj',
    'fbx',
    // fonts
    'ttf',
    'otf',
    'woff',
    'woff2',
    // pdf & images
    'pdf',
    'jpg',
    'jpeg',
    'apng',
    'png',
    'gif',
    'bmp',
    'webp',
    'avif',
]);

const handledDataLoaded = (e: ProgressEvent<FileReader>) => {
    if (e?.target?.result) {
        log(`handledDataLoaded: size: ${e.total}`);
        const content = e.target.result;
        if (typeof content === 'string') {
            useStore.setState({
                fileContent: content,
                fileSize: e.total,
            });
        } else if (content instanceof ArrayBuffer) {
            useStore.setState({
                fileContent: content,
                fileSize: e.total,
            });
        } else {
            log('File content not supported');
        }
    }
};

export const openFile = (file: File) => {
    log(`openFile: ${file.name}`);
    const ext = file.name.split('.').pop()?.toLocaleLowerCase() || '';

    const url = URL.createObjectURL(file); // returns a blob url - won't expose local file system location
    const fileReader = new FileReader();
    fileReader.onloadend = handledDataLoaded;
    if (BINARY_EXTENSIONS.has(ext)) {
        fileReader.readAsArrayBuffer(file);
    } else {
        fileReader.readAsText(file);
    }
    useStore.getState().actions.updateFileData({
        fileSize: 0,
        fileContent: null,
        fileName: file.name,
        fileExt: ext,
        fileUrl: url,
    });
};
