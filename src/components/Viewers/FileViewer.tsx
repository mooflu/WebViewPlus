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
import ImageViewer from '@components/Viewers/ImageViewer';
import JupyterNBViewer from '@components/Viewers/JupyterNBViewer';
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
    const viewerType = useStore(state => state.activeViewer);
    const setActiveViewer = useStore(state => state.actions.setActiveViewer);

    React.useEffect(() => {
        for (const p of plugins) {
            if (!p.enabled) continue;

            if (p.extensions[fileExt]) {
                setActiveViewer(p.viewerType);
                return;
            }

            if (p.extraExtensions.filter(e => e.split(':')[0] === fileExt).length > 0) {
                setActiveViewer(p.viewerType);
                return;
            }
        }
        setActiveViewer(ViewerType.Unknown);
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
                [ViewerType.Image]: <ImageViewer />,
                [ViewerType.Jupyter]: <JupyterNBViewer />,
                [ViewerType.Unknown]: <FileTypeNotSupported />,
            }[viewerType]}
        </>
    );
};

export default FileViewer;
