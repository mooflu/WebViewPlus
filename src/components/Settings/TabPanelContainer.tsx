import React from 'react';

import {
    Box,
} from '@mui/material';

interface TabPanelContainerProps {
    children?: React.ReactNode;
    viewerType: number;
    value: number;
}

const TabPanelContainer: React.FC<TabPanelContainerProps> = (props) => {
    const { children, value, viewerType } = props;

    return (
        <Box
            component="div"
            role="tabpanel"
            hidden={value !== viewerType}
            id={`vertical-tabpanel-${viewerType}`}
            aria-labelledby={`vertical-tab-${viewerType}`}
            sx={{ width: '100%' }}
        >
            {value === viewerType && (
                <Box component="div" sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </Box>
    );
};

export default TabPanelContainer;
