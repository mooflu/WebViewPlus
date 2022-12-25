import React from 'react';
import { useTranslation } from 'react-i18next';

import {
    Box,
    Checkbox,
    FormGroup,
    FormControlLabel,
    TextField,
    Typography,
} from '@mui/material';

import useStore from '@hooks/useStore';
import { IPlugin, ViewerType } from '@plugins/PluginInterface';

interface PluginPanelProps {
    p: IPlugin;
}

const PluginPanel: React.FC<PluginPanelProps> = (props) => {
    const { t } = useTranslation();
    const { p } = props;
    const toggleExtension = useStore(state => state.actions.toggleExtension);
    const setExtraExtensions = useStore(state => state.actions.setExtraExtensions);
    const [extensionsStr, setExtensionsStr] = React.useState(p.extraExtensions.join(','));

    React.useEffect(() => {
        setExtensionsStr(p.extraExtensions.join(','));
    }, [p]);

    const extensionItems = Object.keys(p.extensions).map((ext: string) => {
        const checked = p.extensions[ext];
        const enabled = p.enabled && !(p.viewerType === ViewerType.IFrame && ext === 'htm');
        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            toggleExtension(ext, p.shortName);
        };
        return (
            <FormControlLabel
                key={ext}
                sx={{ width: '8rem' }}
                control={<Checkbox disabled={!enabled} checked={checked} onChange={handleChange} />}
                label={ext}
            />
        );
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const extraExtensions = event.target.value.split(',').map(e => e.trim().replace('.', '').toLocaleLowerCase());
        setExtraExtensions(extraExtensions.filter(ext => ext.length > 0), p.shortName);
        setExtensionsStr(event.target.value);
    };

    return (
        <>
            <Typography variant="h6" sx={{ mb: '1rem' }}>
                {t('FileExtensions')}
            </Typography>
            <Box component="div" sx={{ display: 'flex' }}>
                <FormGroup sx={{ flexDirection: 'row' }}>
                    {extensionItems}
                </FormGroup>
            </Box>
            <TextField
                fullWidth
                spellCheck={false}
                sx={{ mt: '1rem' }}
                size="small"
                label={t('ExtraExtensionsLabel')}
                variant="outlined"
                onChange={handleChange}
                value={extensionsStr}
            />
            <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                {t('NoteExtraExtensions')}
            </Typography>
        </>
    );
};

export default PluginPanel;
