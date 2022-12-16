import React from 'react';

import { Box, SxProps } from '@mui/material';

import { IPlugin } from './PluginInterface';
import useStore from '@hooks/useStore';

const classes = {
    root: {
        width: '100%',
        height: '100%',
    } as SxProps,
};

const IFrameViewer: React.FC = () => {
    const fileUrl = useStore((state) => state.fileUrl);
    return (
        <Box sx={classes.root}>
            <iframe
                title='iframe preview'
                width='100%'
                height='100%'
                frameBorder='0'
                src={fileUrl}
            ></iframe>
        </Box>
    );
};

export class IFramePlugin implements IPlugin {
    public shortName = 'iframe';
    public name = 'Native via iframe';
    public extensions = new Set<string>();
    public viewer = (<IFrameViewer />);

    constructor() {
        this.extensions.add('html');
        this.extensions.add('htm');
        this.extensions.add('mht');
        this.extensions.add('mhtml');
        this.extensions.add('pdf');
        this.extensions.add('webp');
    }
}
