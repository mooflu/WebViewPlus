import React from 'react';

import useStore from '@hooks/useStore';

const FileViewer: React.FC = () => {
    const fileExt = useStore((state) => state.fileExt);
    const plugins = useStore((state) => state.plugins);
    const disabledExtensions = useStore((state) => state.disabledExtensions);

    let viewer: JSX.Element | null = null;
    for (const p of plugins) {
        const isDisabled =
            disabledExtensions[fileExt] &&
            disabledExtensions[fileExt][p.shortName];

        if (isDisabled) continue;

        if (p.extensions.has(fileExt)) {
            viewer = p.viewer;
            break;
        }
    }

    if (viewer) {
        return <>{viewer}</>;
    }
    return <div>File type not supported.</div>;
};

export default FileViewer;
