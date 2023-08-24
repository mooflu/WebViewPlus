import React from 'react';
import { useTranslation } from 'react-i18next';

import {
    Box,
    FormControlLabel,
    Grid,
    Input,
    Switch,
    Slider,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';

import useStore from '@hooks/useStore';

const MIN_SYNTAX_FONT_SIZE = 5;
const MAX_SYNTAX_FONT_SIZE = 72;
const CustomFontExample1 = 'local("Cascadia Mono")';
const CustomFontExample2 = 'url("https://fonts.gstatic.com/s/novamono/v18/Cn-0JtiGWQ5Ajb--MRKvZ2ZZ.woff2")';

const SyntaxViewerSettings: React.FC = () => {
    const { t } = useTranslation();
    const syntaxShowLineNumbers = useStore(state => state.syntaxShowLineNumbers);
    const toggleSyntaxShowLineNumbers = useStore(state => state.actions.toggleSyntaxShowLineNumbers);
    const syntaxWrapLines = useStore(state => state.syntaxWrapLines);
    const toggleSyntaxWrapLines = useStore(state => state.actions.toggleSyntaxWrapLines);
    const syntaxFontSize = useStore(state => state.syntaxFontSize);
    const setSyntaxFontSize = useStore(state => state.actions.setSyntaxFontSize);
    const syntaxCustomFont = useStore(state => state.syntaxCustomFont);
    const setSyntaxCustomFont = useStore(state => state.actions.setSyntaxCustomFont);

    const handleFontSizeChange = (event: Event, newValue: number | number[]) => {
        setSyntaxFontSize(newValue as number);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSyntaxFontSize(event.target.value === '' ? 0 : Number(event.target.value));
    };

    const handleBlur = () => {
        if (syntaxFontSize < MIN_SYNTAX_FONT_SIZE) {
            setSyntaxFontSize(MIN_SYNTAX_FONT_SIZE);
        } else if (syntaxFontSize > MAX_SYNTAX_FONT_SIZE) {
            setSyntaxFontSize(MAX_SYNTAX_FONT_SIZE);
        }
    };

    return (
        <Box component="div">
            <Typography variant="h6" sx={{ mt: '1rem', mb: '1rem' }}>
                {t('ExtraSettings')}
            </Typography>

            <Box component="div">
                <FormControlLabel
                    control={
                        <Switch checked={syntaxShowLineNumbers} onChange={toggleSyntaxShowLineNumbers} name="showLineNumbers" />
                    }
                    label={t('ShowLineNumbers')}
                />
            </Box>

            <Box component="div">
                <FormControlLabel
                    control={
                        <Switch checked={syntaxWrapLines} onChange={toggleSyntaxWrapLines} name="wrapLines" />
                    }
                    label={t('WrapLines')}
                />
            </Box>

            <Box component="div">
                <Typography variant="body1" sx={{ mt: '1rem' }}>
                    {t('FontSize')}
                </Typography>

                <Grid container spacing={2} alignItems="center" sx={{ ml: 0, width: '40rem' }}>
                    <Grid item>
                        <Slider
                            sx={{ width: '15rem' }}
                            min={MIN_SYNTAX_FONT_SIZE}
                            max={MAX_SYNTAX_FONT_SIZE}
                            value={typeof syntaxFontSize === 'number' ? syntaxFontSize : 0}
                            onChange={handleFontSizeChange}
                        />
                    </Grid>
                    <Grid item>
                        <Input
                            sx={{ width: '3rem' }}
                            value={syntaxFontSize}
                            size="small"
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            inputProps={{
                                step: 1,
                                min: MIN_SYNTAX_FONT_SIZE,
                                max: MAX_SYNTAX_FONT_SIZE,
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
                                {t('CustomFontExplain')}
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
                        value={syntaxCustomFont}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setSyntaxCustomFont(event.target.value);
                        }}
                    />
                </Tooltip>
            </Box>
        </Box>
    );
};

export default SyntaxViewerSettings;
