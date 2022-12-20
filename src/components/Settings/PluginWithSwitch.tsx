import React from 'react';

import {
    Box,
    Typography,
    Switch,
} from '@mui/material';

import useStore from '@hooks/useStore';
import { IPlugin } from '@plugins/PluginInterface';

interface PluginWithSwitchProps {
    p: IPlugin;
}

const PluginWithSwitch: React.FC<PluginWithSwitchProps> = (props) => {
    const { p } = props;
    const togglePlugin = useStore(state => state.actions.togglePlugin);

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
            <Typography>
                {p.name}
            </Typography>
            <Switch checked={p.enabled} onChange={handleChange} />
        </Box>
    );
};

export default PluginWithSwitch;
