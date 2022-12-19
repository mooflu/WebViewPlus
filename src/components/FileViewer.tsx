import React from 'react';

import IFrameViewer from '@components/IFrameViewer';
import MarkdownViewer from '@components/MarkdownViewer';
import ModelViewer from '@components/ModelViewer';
import SVGViewer from '@components/SVGViewer';
import SyntaxViewer from '@components/SyntaxViewer';
import TabularViewer from '@components/TabularViewer';
// import JupyterNBViewer from '@components/JupyterNBViewer';

import { ViewerType } from '@plugins/PluginInterface';

import useStore from '@hooks/useStore';

const FileViewer: React.FC = () => {
    const fileExt = useStore((state) => state.fileExt);
    const plugins = useStore((state) => state.plugins);
    const [viewerType, setViewerType] = React.useState<ViewerType>(ViewerType.Unknown);
    const disabledExtensions = useStore((state) => state.disabledExtensions);

    React.useEffect(() => {
        for (const p of plugins) {
            const isDisabled =
                disabledExtensions[fileExt] &&
                disabledExtensions[fileExt][p.shortName];

            if (isDisabled) continue;

            if (p.extensions.has(fileExt)) {
                setViewerType(p.viewerType);
                break;
            }
        }
    }, [fileExt, plugins]);

    return (
        <>
            {{
                [ViewerType.IFrame]: <IFrameViewer />,
                [ViewerType.Markdown]: <MarkdownViewer />,
                [ViewerType.Model3D]: <ModelViewer />,
                [ViewerType.SVG]: <SVGViewer />,
                [ViewerType.Syntax]: <SyntaxViewer />,
                [ViewerType.Tabular]: <TabularViewer />,
                [ViewerType.Unknown]:  <div>File type not supported.</div>,
            }[viewerType]}
        </>
    )
};

export default FileViewer;
