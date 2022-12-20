import React from 'react';

import {
    Box,
    Typography,
} from '@mui/material';

interface TabPanelContainerProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanelContainer: React.FC<TabPanelContainerProps> = (props) => {
    const { children, value, index } = props;

    return (
        <Box
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
        >
            {value === index && (
                <Box component="div" sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </Box>
    );
};

export default TabPanelContainer;
