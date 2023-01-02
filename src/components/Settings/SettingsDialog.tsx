import React from 'react';
import { useTranslation } from 'react-i18next';

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
import { ViewerType } from '@plugins/PluginInterface';
import WebViewPlus from '@components/icons/WebViewPlus';

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
    const { t } = useTranslation();
    const showSettings = useStore(state => state.showSettings);
    const plugins = useStore(state => state.plugins);
    const savePluginSettings = useStore(state => state.actions.savePluginSettings);
    const [value, setValue] = React.useState(0);

    const closeSettings = () => {
        savePluginSettings();
        useStore.setState({ showSettings: false });
    };

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const pluginTabs = plugins.map((p) => {
        const name = t(p.shortName, { keyPrefix: 'pluginName' });
        const withSwitch = p.viewerType !== ViewerType.IFrame;
        return (
            <Tab
                key={name}
                sx={{
                    minHeight: '3rem',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textTransform: 'initial',
                }}
                label={<PluginWithSwitch p={p} withSwitch={withSwitch} />}
            />
        );
    });

    const pluginTabPanelContainers = plugins.map((p, i) => {
        return (
            <TabPanelContainer key={p.shortName} value={value} index={i}>
                <PluginPanel p={p} />
            </TabPanelContainer>
        );
    });

    return (
        <Dialog
            open={showSettings}
            onClose={closeSettings}
            TransitionComponent={Transition}
            fullScreen
        >
            <DialogTitle sx={{ p: '0.7rem' }}>
                <Box component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                    <WebViewPlus sx={{ fontSize: '2.2rem' }} />
                    <Typography component="span" sx={{ fontSize: '1.6rem', ml: '1rem' }}>{t('Settings')}</Typography>
                </Box>
                <IconButton
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                    onClick={closeSettings}
                >
                    <CloseIcon />
                </IconButton>
                <Button
                    variant="outlined"
                    sx={{ position: 'absolute', right: 11, bottom: 8 }}
                    onClick={closeSettings}
                >
                    {t('Close')}
                </Button>
            </DialogTitle>

            <DialogContent sx={{ margin: 0, padding: 0, bgcolor: 'background.default' }}>
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
                <Box
                    component="div"
                    sx={{ position: 'absolute', bottom: 0, left: 5 }}
                >
                    <Typography sx={{ fontSize: '0.7rem', opacity: '0.3' }}>{APP_VERSION}</Typography>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default SettingsDialog;
