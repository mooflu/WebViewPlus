import React from 'react';

import {
    Box,
    Button,
    Dialog,
    Slide,
    IconButton,
    Tabs,
    Tab,
    Typography,
    DialogTitle,
    DialogContent,
} from '@mui/material';
import {
    Close as CloseIcon,
} from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';

import useStore from '@hooks/useStore';

import PluginPanel from './PluginPanel';
import PluginWithSwitch from './PluginWithSwitch';
import TabPanelContainer from './TabPanelContainer';

const Transition = React.forwardRef((
    props: TransitionProps & { children: React.ReactElement<any, any>; },
    ref: React.Ref<unknown>,
) => {
    return <Slide direction="down" ref={ref} {...props} />;
});

const SettingsDialog: React.FC = () => {
    const showConfig = useStore(state => state.showConfig);
    const plugins = useStore(state => state.plugins);
    const [value, setValue] = React.useState(0);

    const closeSettings = () => {
        useStore.setState({ showConfig: false });
    };

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const pluginTabs = plugins.map((p) => {
        return (
            <Tab
                key={p.name}
                sx={{
                    minHeight: '3rem',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textTransform: 'initial',
                }}
                label={<PluginWithSwitch p={p} />}
            />
        );
    });

    const pluginTabPanelContainers = plugins.map((p, i) => {
        return (
            <TabPanelContainer key={p.name} value={value} index={i}>
                <PluginPanel p={p} />
            </TabPanelContainer>
        );
    });

    return (
        <Dialog
            open={showConfig}
            onClose={closeSettings}
            TransitionComponent={Transition}
            fullScreen
        >
            <DialogTitle>
                <Typography sx={{ fontSize: '1.6rem' }}>Settings</Typography>
                <IconButton
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                    onClick={closeSettings}
                    aria-label="close"
                >
                    <CloseIcon />
                </IconButton>
                <Button
                    variant="outlined"
                    sx={{ position: 'absolute', right: 11, bottom: 8 }}
                    onClick={closeSettings}
                >
                    Close
                </Button>
            </DialogTitle>

            <DialogContent sx={{ margin: 0, padding: 0, bgcolor: 'background.paper' }}>
                <Box
                    component="div"
                    sx={{ flexGrow: 1, display: 'flex', height: '100%' }}
                >
                    <Tabs
                        orientation="vertical"
                        visibleScrollbar
                        value={value}
                        onChange={handleChange}
                        sx={{ minWidth: '14rem', borderRight: 1, borderColor: 'divider' }}
                    >
                        {pluginTabs}
                    </Tabs>
                    {pluginTabPanelContainers}
                </Box>
            </DialogContent>

        </Dialog>
    );
};

export default SettingsDialog;
