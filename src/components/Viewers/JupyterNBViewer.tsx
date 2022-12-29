import React from 'react';
import { useTranslation } from 'react-i18next';

import { Box } from '@mui/material';

import useStore from '@hooks/useStore';
import * as NB from '@components/Jupyter/JupyterCommon';
import Notebook from '@components/Jupyter/Notebook';

const JupyterNBViewer: React.FC = () => {
    const { t } = useTranslation();
    const fileContent = useStore(state => state.fileContent) as string;
    const nb: NB.Notebook = JSON.parse(fileContent);

    React.useEffect(() => {
        // switching between notebooks, doesn't return to the top of doc
        window.scrollTo(0, 0);
    }, []);

    const notSupported = nb.nbformat < 4;
    return (
        <Box component="div" sx={{ width: '100%', height: '100%', lineHeight: '1.2rem' }}>
            {notSupported ? (
                <>{t('UnsupportedVersion')}</>
            ) : (
                <Notebook nb={nb} />
            )}
        </Box>
    );
};

export default JupyterNBViewer;
