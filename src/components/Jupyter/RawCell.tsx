import React from 'react';

import { Box, useTheme } from '@mui/material';

import * as NB from '@components/Jupyter/JupyterCommon';

interface RawCellProps {
    cell: NB.RawCell;
}

const RawCell: React.FC<RawCellProps> = (props) => {
    const { cell } = props;
    const theme = useTheme();
    const rawText = NB.joinData(cell.source);

    return (
        <Box
            component="pre"
            sx={{
                fontStyle: 'italic',
                padding: '0.5rem',
                borderRadius: '0.2rem',
                border: `1px solid ${theme.palette.background.paper}`,
            }}
        >
            {rawText}
        </Box>
    );
};

export default RawCell;
