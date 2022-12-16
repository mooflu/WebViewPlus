import React from 'react';

import {
    Box,
    Dialog,
    Slide,
    AppBar,
    Toolbar,
    IconButton,
    ListSubheader,
    ListItemText,
    ListItemButton,
    List,
    Divider,
    Typography,
    SxProps,
} from '@mui/material';

import {
    Close as CloseIcon,
    Block as BlockIcon,
} from '@mui/icons-material';

import { TransitionProps } from '@mui/material/transitions';

import useStore from '@hooks/useStore';
import { IPlugin } from '@plugins/PluginInterface';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement<any, any>; },
    ref: React.Ref<unknown>,
) {
    return <Slide direction='up' ref={ref} {...props} />;
});

const classes = {
    grow: {
        flexGrow: 1,
    } as SxProps,
    pluginHeader: {
        fontSize: '1.5rem',
    } as SxProps,
    disabled: {
        color: '#aaa',
    } as SxProps,
};

type ExtensionItemProps = {
    plugin: IPlugin;
    extension: string;
};

const ExtensionItem: React.FC<ExtensionItemProps> = (props) => {
    const disabledExtensions = useStore((state) => state.disabledExtensions);
    const toggleExtension = useStore((state) => state.actions.toggleExtension);
    const isDisabled =
        disabledExtensions[props.extension] &&
        disabledExtensions[props.extension][props.plugin.shortName];

    const toggleExtensionClicked = () => {
        toggleExtension(props.extension, props.plugin.shortName);
    };

    return (
        <ListItemButton
            sx={isDisabled ? classes.disabled : {}}
            dense
            onClick={toggleExtensionClicked}
        >
            <ListItemText inset primary={props.extension} />
            {isDisabled && <BlockIcon />}
        </ListItemButton>
    );
};

const SettingsDialog: React.FC = () => {
    const showConfig = useStore((state) => state.showConfig);
    const plugins = useStore((state) => state.plugins);

    const closeSettings = () => {
        useStore.setState({ showConfig: false });
    };

    const listItems = plugins.map((p) => {
        const extensionItems = Array.from(p.extensions).map((e) => {
            const key = `${p.name}-${e}`;
            return <ExtensionItem key={key} plugin={p} extension={e} />;
        });

        return (
            <div key={p.name}>
                <ListSubheader sx={classes.pluginHeader}>
                    {p.name}
                </ListSubheader>
                {extensionItems}
                <Divider />
            </div>
        );
    });

    return (
        <Dialog
            open={showConfig}
            onClose={closeSettings}
            TransitionComponent={Transition}
        >
            <AppBar position='sticky'>
                <Toolbar>
                    <Typography variant='h6'>Settings</Typography>
                    <Box sx={classes.grow} />
                    <IconButton
                        edge='end'
                        color='inherit'
                        onClick={closeSettings}
                        aria-label='close'
                    >
                        <CloseIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <List>{listItems}</List>
        </Dialog>
    );
};

export default SettingsDialog;
