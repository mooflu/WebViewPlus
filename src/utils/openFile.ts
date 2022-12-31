import useStore from '@hooks/useStore';
import { log } from '@utils/log';

const handledDataLoaded = (e: ProgressEvent<FileReader>) => {
    if (e?.target?.result) {
        log(`handledDataLoaded: size: ${e.total}`);
        const content = e.target.result;
        if (typeof content === 'string') {
            useStore.setState({ fileContent: content, fileSize: e.total });
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
    if (
        ext === 'xlsx' ||
        ext === 'xls' ||
        ext === 'ods' ||
        ext === 'gltf' ||
        ext === 'glb' ||
        ext === 'pdf' ||
        ext === 'webp'
    ) {
        fileReader.readAsArrayBuffer(file);
    } else {
        fileReader.readAsText(file);
    }
    useStore.setState({
        fileName: file.name,
        fileExt: ext,
        fileUrl: url,
    });
};
