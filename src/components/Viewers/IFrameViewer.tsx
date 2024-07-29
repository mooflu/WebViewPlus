import React from 'react';

import { Box, SxProps } from '@mui/material';

import useStore from '@hooks/useStore';
import { log } from '@utils/log';

const classes = {
    root: {
        width: '100%',
        height: '100%',
        iframe: {
            border: 'none',
        },
    },
} satisfies Record<string, SxProps>;

const IFrameViewer: React.FC = () => {
    const fileUrl = useStore(state => state.fileUrl);
    log(`IFrameViewer url:${fileUrl}`);
    return (
        <Box component="div" sx={classes.root}>
            <iframe
                title="iframe preview"
                width="100%"
                height="100%"
                src={fileUrl}
                style={{ display: 'block' }} // iframe is inline by default which adds extra space at bottom
            />
        </Box>
    );
};

export default IFrameViewer;
