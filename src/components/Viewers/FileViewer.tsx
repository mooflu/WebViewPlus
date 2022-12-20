import React from 'react';

import {
    Box,
    Typography,
} from '@mui/material';

import IFrameViewer from '@components/Viewers/IFrameViewer';
import MarkdownViewer from '@components/Viewers/MarkdownViewer';
import ModelViewer from '@components/Viewers/ModelViewer';
import SVGViewer from '@components/Viewers/SVGViewer';
import SyntaxViewer from '@components/Viewers/SyntaxViewer';
import TabularViewer from '@components/Viewers/TabularViewer';
// import JupyterNBViewer from '@components/Viewers/JupyterNBViewer';
import { ViewerType } from '@plugins/PluginInterface';
import useStore from '@hooks/useStore';

const FileTypeNotSupported: React.FC = () => {
    return (
        <Box
            component="div"
            sx={{
                display: 'flex',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '1rem',
            }}
        >
            <Typography variant="h4">
                File type not enabled or not supported.
            </Typography>
        </Box>
    );
};

const FileViewer: React.FC = () => {
    const fileExt = useStore(state => state.fileExt);
    const plugins = useStore(state => state.plugins);
    const [viewerType, setViewerType] = React.useState<ViewerType>(ViewerType.Unknown);

    React.useEffect(() => {
        setViewerType(ViewerType.Unknown);
        for (const p of plugins) {
            if (!p.enabled) continue;

            if (p.extensions[fileExt]) {
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
                [ViewerType.Jupyter]: <FileTypeNotSupported />,
                [ViewerType.Unknown]: <FileTypeNotSupported />,
            }[viewerType]}
        </>
    );
};

export default FileViewer;
