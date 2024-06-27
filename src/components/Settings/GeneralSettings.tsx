import React from 'react';
import { useTranslation } from 'react-i18next';

import {
    Box,
    Button,
    FormControlLabel,
    Switch,
    Typography,
} from '@mui/material';

import useStore from '@hooks/useStore';

const GeneralSettings: React.FC = () => {
    const { t } = useTranslation();
    const detectEncoding = useStore(state => state.detectEncoding);
    const setDetectEncoding = useStore(state => state.actions.setDetectEncoding);
    const showTrayIcon = useStore(state => state.showTrayIcon);
    const setShowTrayIcon = useStore(state => state.actions.setShowTrayIcon);
    const useTransparency = useStore(state => state.useTransparency);
    const setUseTransparency = useStore(state => state.actions.setUseTransparency);
    const restartQuickLook = useStore(state => state.actions.restartQuickLook);
    const [restartInProgress, setRestartInProgress] = React.useState(false);

    const toggleDetectEncoding = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setDetectEncoding(checked);
    };

    const toggleShowTrayIcon = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setShowTrayIcon(checked);
    };

    const toggleUseTransparency = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setUseTransparency(checked);
    };

    const sendRestart = () => {
        setRestartInProgress(true);
        restartQuickLook();
    };

    return (
        <Box component="div">
            <Typography variant="h6" sx={{ mt: '1rem', mb: '1rem' }}>
                {t('GeneralWebViewPlus')}
            </Typography>

            <Box component="div">
                <FormControlLabel
                    control={
                        <Switch checked={detectEncoding} onChange={toggleDetectEncoding} name="detectEncoding" />
                    }
                    label={t('DetectEncoding')}
                    title={t('DetectEncodingTooltip')}
                />
            </Box>

            <Typography variant="h6" sx={{ mt: '1rem', mb: '1rem' }}>
                {t('GeneralQuickLook')}
            </Typography>

            <Box component="div">
                <FormControlLabel
                    control={
                        <Switch checked={showTrayIcon} onChange={toggleShowTrayIcon} name="showTrayIcon" />
                    }
                    label={t('ShowTrayIcon')}
                    title={t('ShowTrayIconTooltip')}
                />
            </Box>

            <Box component="div">
                <FormControlLabel
                    control={
                        <Switch checked={useTransparency} onChange={toggleUseTransparency} name="useTransparency" />
                    }
                    label={t('UseTransparency')}
                    title={t('UseTransparencyTooltip')}
                />
            </Box>

            <Box component="div" sx={{ mt: '1rem' }}>
                <Button variant="outlined" onClick={sendRestart} disabled={restartInProgress}>
                    {t('RestartQuicklook')}
                </Button>
            </Box>
        </Box>
    );
};

export default GeneralSettings;
