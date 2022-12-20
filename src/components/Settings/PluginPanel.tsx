import React from 'react';

import {
    Box,
    Checkbox,
    FormGroup,
    FormControlLabel,
    Typography,
} from '@mui/material';

import useStore from '@hooks/useStore';
import { IPlugin } from '@plugins/PluginInterface';

interface PluginPanelProps {
    p: IPlugin;
}

const PluginPanel: React.FC<PluginPanelProps> = (props) => {
    const { p } = props;
    const toggleExtension = useStore(state => state.actions.toggleExtension);

    const extensionItems = Object.keys(p.extensions).map((ext: string) => {
        const enabled = p.extensions[ext];
        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            toggleExtension(ext, p.shortName);
        };
        return (
            <FormControlLabel
                key={ext}
                sx={{ width: '8rem' }}
                control={<Checkbox disabled={!p.enabled} checked={enabled} onChange={handleChange} />}
                label={ext}
            />
        );
    });

    return (
        <>
            <Typography variant="h6" sx={{ mb: '1rem' }}>
                File Extensions
            </Typography>
            <Box component="div" sx={{ display: 'flex' }}>
                <FormGroup sx={{ flexDirection: 'row' }}>
                    {extensionItems}
                </FormGroup>
            </Box>
        </>
    );
};

export default PluginPanel;
