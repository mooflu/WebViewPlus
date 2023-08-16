import React from 'react';
import { useTranslation } from 'react-i18next';

import {
    Box,
    FormControlLabel,
    Switch,
    Typography,
} from '@mui/material';

import useStore from '@hooks/useStore';

const ImageViewerSettings: React.FC = () => {
    const { t } = useTranslation();
    const pixelated = useStore(state => state.pixelated);
    const togglePixelated = useStore(state => state.actions.togglePixelated);

    return (
        <Box component="div">
            <Typography variant="h6" sx={{ mt: '1rem', mb: '1rem' }}>
                {t('ExtraSettings')}
            </Typography>

            <FormControlLabel
                control={
                    <Switch checked={pixelated} onChange={togglePixelated} name="pixelated" />
                }
                label={t('Pixelated')}
            />
        </Box>
    );
};

export default ImageViewerSettings;
