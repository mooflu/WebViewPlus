import React from 'react';

import useStore from '@hooks/useStore';

const FileViewer: React.FC = () => {
    const fileExt = useStore((state) => state.fileExt);
    const plugins = useStore((state) => state.plugins);
    const [viewer, setViewer] = React.useState<JSX.Element | null>(null);
    const disabledExtensions = useStore((state) => state.disabledExtensions);

    React.useEffect(() => {
        for (const p of plugins) {
            const isDisabled =
                disabledExtensions[fileExt] &&
                disabledExtensions[fileExt][p.shortName];

            if (isDisabled) continue;

            if (p.extensions.has(fileExt)) {
                setViewer(p.viewer);
                break;
            }
        }
    }, [fileExt, plugins]);

    if (viewer) {
        return <>{viewer}</>;
    }
    return <div>File type not supported.</div>;
};

export default FileViewer;
