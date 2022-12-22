import React from 'react';
import { useTranslation } from 'react-i18next';

import {
    Box,
    Typography,
    Switch,
} from '@mui/material';

import useStore from '@hooks/useStore';
import { IPlugin } from '@plugins/PluginInterface';

interface PluginWithSwitchProps {
    p: IPlugin;
    withSwitch: boolean;
}

const PluginWithSwitch: React.FC<PluginWithSwitchProps> = (props) => {
    const { t } = useTranslation();
    const { p, withSwitch } = props;
    const togglePlugin = useStore(state => state.actions.togglePlugin);
    const name = t(p.shortName, { keyPrefix: 'pluginName' });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        togglePlugin(p);
    };

    return (
        <Box
            component="div"
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
            }}
        >
            <Typography sx={{ color: p.enabled ? '' : 'action.disabled' }}>
                {name}
            </Typography>
            {withSwitch && <Switch checked={p.enabled} onChange={handleChange} />}
        </Box>
    );
};

export default PluginWithSwitch;
