import React from 'react';

import { Box } from '@mui/material';

import * as NB from '@components/Jupyter/JupyterTypes';

interface RawCellProps {
    cell: NB.RawCell;
}

const RawCell: React.FC<RawCellProps> = (props) => {
    const { cell } = props;

    return (
        <Box component="div">Raw {cell.source}[0]</Box>
    );
};

export default RawCell;
