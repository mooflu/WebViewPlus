import React from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { TransitionProps } from '@material-ui/core/transitions';

import CloseIcon from '@material-ui/icons/Close';
import BlockIcon from '@material-ui/icons/Block';

import useStore from '@hooks/useStore';
import { IPlugin } from '@plugins/PluginInterface';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement },
    ref: React.Ref<unknown>
) {
    return <Slide direction='up' ref={ref} {...props} />;
});

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        grow: {
            flexGrow: 1,
        },
        pluginHeader: {
            fontSize: '1.5rem',
        },
        disabled: {
            color: '#aaa',
        },
    })
);

type ExtensionItemProps = {
    plugin: IPlugin;
    extension: string;
};

const ExtensionItem: React.FC<ExtensionItemProps> = (props) => {
    const classes = useStyles();
    const disabledExtensions = useStore((state) => state.disabledExtensions);
    const toggleExtension = useStore((state) => state.actions.toggleExtension);
    const isDisabled =
        disabledExtensions[props.extension] &&
        disabledExtensions[props.extension][props.plugin.shortName];

    const toggleExtensionClicked = () => {
        toggleExtension(props.extension, props.plugin.shortName);
    };

    return (
        <ListItem
            className={isDisabled ? classes.disabled : ''}
            dense
            button
            onClick={toggleExtensionClicked}
        >
            <ListItemText inset primary={props.extension} />
            {isDisabled && <BlockIcon />}
        </ListItem>
    );
};

const SettingsDialog: React.FC = () => {
    const classes = useStyles();
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
                <ListSubheader className={classes.pluginHeader}>
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
                    <div className={classes.grow} />
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
