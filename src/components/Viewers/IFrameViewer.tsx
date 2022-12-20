import React from 'react';

import { Box, SxProps } from '@mui/material';

import useStore from '@hooks/useStore';

const classes = {
    root: {
        width: '100%',
        height: '100%',
        iframe: {
            border: 'none',
        },
    } as SxProps,
};

const IFrameViewer: React.FC = () => {
    const fileUrl = useStore(state => state.fileUrl);
    return (
        <Box component="div" sx={classes.root}>
            <iframe
                title="iframe preview"
                width="100%"
                height="100%"
                src={fileUrl}
            />
        </Box>
    );
};

export default IFrameViewer;
