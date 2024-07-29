import React from 'react';
import { useTranslation } from 'react-i18next';

import {
    Box,
    Grid,
    Input,
    Slider,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';

import useStore from '@hooks/useStore';

const MIN_EPUB_FONT_SIZE = 0;
const MAX_EPUB_FONT_SIZE = 72;
const CustomFontExample1 = 'Helvetica';
const CustomFontExample2 = 'system-ui';

const EPubViewerSettings: React.FC = () => {
    const { t } = useTranslation();
    const ePubFontSize = useStore(state => state.ePubFontSize);
    const setEPubFontSize = useStore(state => state.actions.setEPubFontSize);
    const ePubCustomFont = useStore(state => state.ePubCustomFont);
    const setEPubCustomFont = useStore(state => state.actions.setEPubCustomFont);

    const handleFontSizeChange = (event: Event, newValue: number | number[]) => {
        setEPubFontSize(newValue as number);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEPubFontSize(event.target.value === '' ? 0 : Number(event.target.value));
    };

    const handleBlur = () => {
        if (ePubFontSize < MIN_EPUB_FONT_SIZE) {
            setEPubFontSize(MIN_EPUB_FONT_SIZE);
        } else if (ePubFontSize > MAX_EPUB_FONT_SIZE) {
            setEPubFontSize(MAX_EPUB_FONT_SIZE);
        }
    };

    return (
        <Box component="div">
            <Typography variant="h6" sx={{ mt: '1rem', mb: '1rem' }}>
                {t('ExtraSettings')}
            </Typography>

            <Box component="div">
                <Typography variant="body1" sx={{ mt: '1rem' }}>
                    {t('FontSize')}
                </Typography>

                <Grid container spacing={2} alignItems="center" sx={{ ml: 0, width: '40rem' }}>
                    <Grid item>
                        <Slider
                            sx={{ width: '15rem' }}
                            min={MIN_EPUB_FONT_SIZE}
                            max={MAX_EPUB_FONT_SIZE}
                            value={typeof ePubFontSize === 'number' ? ePubFontSize : 0}
                            onChange={handleFontSizeChange}
                        />
                    </Grid>
                    <Grid item>
                        <Input
                            sx={{ width: '3rem' }}
                            value={ePubFontSize}
                            size="small"
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            inputProps={{
                                step: 1,
                                min: MIN_EPUB_FONT_SIZE,
                                max: MAX_EPUB_FONT_SIZE,
                                type: 'number',
                            }}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Box component="div">
                <Typography variant="body1" sx={{ mt: '1rem' }}>
                    {t('CustomFont')}
                </Typography>

                <Tooltip
                    placement="bottom-start"
                    title={(
                        <Box component="div">
                            <Typography variant="body1">
                                {t('EpubCustomFontExplain')}
                            </Typography>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace', whiteSpace: 'break-spaces' }}>
                                {CustomFontExample1}
                            </Typography>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace', whiteSpace: 'break-spaces' }}>
                                {CustomFontExample2}
                            </Typography>
                        </Box>
                    )}
                    componentsProps={{
                        tooltip: { sx: { maxWidth: 'none' } },
                    }}
                >
                    <TextField
                        variant="standard"
                        fullWidth
                        placeholder={t('Default')}
                        value={ePubCustomFont}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setEPubCustomFont(event.target.value);
                        }}
                    />
                </Tooltip>
            </Box>
        </Box>
    );
};

export default EPubViewerSettings;
