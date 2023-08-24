import React from 'react';
import { useTranslation } from 'react-i18next';

import {
    Box,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Switch,
    Typography,
} from '@mui/material';

import useStore from '@hooks/useStore';
import { ImageRendering, ZoomBehaviour } from '@utils/types';

const ImageViewerSettings: React.FC = () => {
    const { t } = useTranslation();
    const imageRendering = useStore(state => state.imageRendering);
    const pixelated = imageRendering === ImageRendering.Pixelated;
    const togglePixelated = useStore(state => state.actions.togglePixelated);
    const newImageZoomBehaviour = useStore(state => state.newImageZoomBehaviour);
    const setNewImageZoomBehaviour = useStore(state => state.actions.setNewImageZoomBehaviour);
    const resizeImageZoomBehaviour = useStore(state => state.resizeImageZoomBehaviour);
    const setResizeImageZoomBehaviour = useStore(state => state.actions.setResizeImageZoomBehaviour);

    const onNewImageZoomBehaviour = (e: SelectChangeEvent<ZoomBehaviour>) => {
        setNewImageZoomBehaviour(e.target.value as ZoomBehaviour);
    };

    const onResizeImageZoomBehaviour = (e: SelectChangeEvent<ZoomBehaviour>) => {
        setResizeImageZoomBehaviour(e.target.value as ZoomBehaviour);
    };

    return (
        <Box component="div">
            <Typography variant="h6" sx={{ mt: '1rem', mb: '1rem' }}>
                {t('ExtraSettings')}
            </Typography>

            <Box component="div">
                <FormControlLabel
                    control={
                        <Switch checked={pixelated} onChange={togglePixelated} name="pixelated" />
                    }
                    label={t('Pixelated')}
                />
            </Box>
            <Box component="div" sx={{ mt: 2, width: '20rem' }}>
                <FormControl fullWidth>
                    <InputLabel id="newImageZoomBehaviourLabel">{t('NewImageZoomBehaviour')}</InputLabel>
                    <Select
                        labelId="newImageZoomBehaviourLabel"
                        size="small"
                        value={newImageZoomBehaviour}
                        onChange={onNewImageZoomBehaviour}
                        label={t('NewImageZoomBehaviour')}
                    >
                        <MenuItem value={ZoomBehaviour.KeepZoom}>{t('KeepZoom')}</MenuItem>
                        <MenuItem value={ZoomBehaviour.ZoomToFit}>{t('ZoomToFit')}</MenuItem>
                        <MenuItem value={ZoomBehaviour.Zoom1To1}>{t('Zoom1To1')}</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box component="div" sx={{ mt: 2, width: '20rem' }}>
                <FormControl fullWidth>
                    <InputLabel id="resizeImageZoomBehaviourLabel">{t('ResizeZoomBehaviour')}</InputLabel>
                    <Select
                        labelId="resizeImageZoomBehaviourLabel"
                        size="small"
                        value={resizeImageZoomBehaviour}
                        onChange={onResizeImageZoomBehaviour}
                        label={t('ResizeZoomBehaviour')}
                    >
                        <MenuItem value={ZoomBehaviour.KeepZoom}>{t('KeepZoom')}</MenuItem>
                        <MenuItem value={ZoomBehaviour.ZoomToFit}>{t('ZoomToFit')}</MenuItem>
                        <MenuItem value={ZoomBehaviour.Zoom1To1}>{t('Zoom1To1')}</MenuItem>
                    </Select>
                </FormControl>
            </Box>
        </Box>
    );
};

export default ImageViewerSettings;
