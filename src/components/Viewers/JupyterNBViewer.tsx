import React from 'react';

import { Box } from '@mui/material';

import useStore from '@hooks/useStore';
import * as NB from '@components/Jupyter/JupyterCommon';
import Notebook from '@components/Jupyter/Notebook';

const JupyterNBViewer: React.FC = () => {
    const fileContent = useStore(state => state.fileContent) as string;
    const nb: NB.Notebook = JSON.parse(fileContent);

    if (nb.nbformat < 4) {
        return <>Unsupported version</>;
    }

    return (
        <Box component="div" sx={{ width: '100%', height: '100%', lineHeight: '1.2rem' }}>
            <Notebook nb={nb} />
        </Box>
    );
};

export default JupyterNBViewer;
