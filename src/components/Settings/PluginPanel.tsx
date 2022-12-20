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
    const disabledExtensions = useStore(state => state.disabledExtensions);
    const toggleExtension = useStore(state => state.actions.toggleExtension);

    const extensionItems = Array.from(p.extensions).map((e) => {
        const isDisabled =
            disabledExtensions[e] &&
            disabledExtensions[e][p.shortName];
        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            toggleExtension(e, p.shortName);
        };
        return (
            <FormControlLabel
                sx={{ width: '8rem' }}
                control={<Checkbox disabled={!p.enabled} checked={!isDisabled} onChange={handleChange} />}
                label={e}
            />
        );
    });

    return (
        <>
            <Typography variant="h5">
                File Extensions:
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
