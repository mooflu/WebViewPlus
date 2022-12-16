import React from 'react';

import { Box, SxProps } from '@mui/material';
import { ModelViewerElement } from '@google/model-viewer';

import { IPlugin } from './PluginInterface';
import useStore from '@hooks/useStore';

ModelViewerElement._dummy_ = undefined; // access imported ModelViewerElement so it's not tree shaken

const classes = {
    root: {
        width: '100%',
        height: '100%',
        '& model-viewer': {
            width: '100%',
            height: '100%',
        },
    },
};

const ModelViewerViewer: React.FC = () => {
    const fileUrl = useStore((state) => state.fileUrl);

    return (
        <Box sx={classes.root}>
            <model-viewer camera-controls src={fileUrl} />
        </Box>
    );
};

export class ModelViewerPlugin implements IPlugin {
    public shortName = 'ModelViewer';
    public name = 'Google model-viewer';
    public extensions = new Set<string>();
    public viewer = (<ModelViewerViewer />);

    constructor() {
        this.extensions.add('gltf');
        this.extensions.add('glb');
    }
}
