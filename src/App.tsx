import React from 'react';

import { CssBaseline, Box, CircularProgress, IconButton, SxProps, useMediaQuery } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
    Settings as SettingsIcon,
    Undo as UndoIcon,
} from '@mui/icons-material';
import { indigo, grey } from '@mui/material/colors';

import SettingsDialog from '@components/SettingsDialog';
import FilePicker from '@components/FilePicker';
import FileViewer from '@components/FileViewer';

import useStore from '@hooks/useStore';
import { initWebview2 } from '@utils/webview2Helpers';

initWebview2();

const classes = {
    root: {
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    } as SxProps,
    floatButton: {
        position: 'fixed',
        bottom: '0.5rem',
        '@media (prefers-color-scheme:light)': {
            backgroundColor: '#ccc',
        },
        '@media (prefers-color-scheme:dark)': {
            color: '#888',
            backgroundColor: '#333',
        },
        opacity: 0.7,
    } as SxProps,
    settingsButton: {
        right: '0.5rem',
    } as SxProps,
    resetButton: {
        right: '3.5rem',
    } as SxProps,
};


const App: React.FC = () => {
    const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const fileContent = useStore((state) => state.fileContent);
    const fileName = useStore((state) => state.fileName);
    const showConfig = useStore((state) => state.showConfig);
    const initState = useStore((state) => state.actions.init);
    // MS webview2
    const isEmbedded = !!(window as any).chrome?.webview;

    const theme = createTheme({
        palette: {
            mode: isDarkMode ? 'dark' : 'light',
            ...(isDarkMode
            ? {
                // palette values for dark mode
                primary: indigo,
                divider: indigo[700],
                background: {
                    default: grey[900],
                    paper: grey[900],
                },
            } : {
                // palette values for light mode
            }),
        },
    });

    React.useEffect(() => {
        initState();
        if (isEmbedded) {
            const extensions = (window as any).WebviewPlus.getExtensions().join(
                ','
            );
            (window as any).chrome.webview.hostObjects.fileProps.extensions =
                extensions;
        }
    }, [initState]);

    let pickerOrViewer: JSX.Element;
    if (fileContent === null) {
        if (isEmbedded || fileName) {
            return (
                <Box sx={classes.root}>
                    <CircularProgress />
                </Box>
            );
        }
        pickerOrViewer = <FilePicker />;
    } else {
        pickerOrViewer = <FileViewer />;
    }

    const toggleSettings = () => {
        useStore.setState({ showConfig: !showConfig });
    };

    const resetFile = () => {
        useStore.setState({ fileName: '', fileSize: 0, fileContent: null });
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {pickerOrViewer}
            <IconButton sx={[classes.floatButton, classes.settingsButton] as SxProps} onClick={toggleSettings}>
                <SettingsIcon />
            </IconButton>
            {!isEmbedded && fileName && (
                <IconButton sx={[classes.floatButton, classes.resetButton] as SxProps} onClick={resetFile}>
                    <UndoIcon />
                </IconButton>
            )}

            <SettingsDialog />
        </ThemeProvider>
    );
};

export default App;
