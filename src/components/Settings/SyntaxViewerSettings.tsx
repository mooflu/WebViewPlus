import React from 'react';
import { useTranslation } from 'react-i18next';

import {
    Box,
    FormControlLabel,
    Switch,
    Typography,
} from '@mui/material';

import useStore from '@hooks/useStore';

const SyntaxViewerSettings: React.FC = () => {
    const { t } = useTranslation();
    const showLineNumbers = useStore(state => state.showLineNumbers);
    const toggleShowLineNumbers = useStore(state => state.actions.toggleShowLineNumbers);
    const wrapLines = useStore(state => state.wrapLines);
    const toggleWrapLines = useStore(state => state.actions.toggleWrapLines);

    return (
        <Box component="div">
            <Typography variant="h6" sx={{ mt: '1rem', mb: '1rem' }}>
                {t('ExtraSettings')}
            </Typography>

            <Box component="div">
                <FormControlLabel
                    control={
                        <Switch checked={showLineNumbers} onChange={toggleShowLineNumbers} name="pixelated" />
                    }
                    label={t('ShowLineNumbers')}
                />
            </Box>

            <Box component="div">
                <FormControlLabel
                    control={
                        <Switch checked={wrapLines} onChange={toggleWrapLines} name="pixelated" />
                    }
                    label={t('WrapLines')}
                />
            </Box>
        </Box>
    );
};

export default SyntaxViewerSettings;
