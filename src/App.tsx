import React from 'react';

import { CssBaseline, Box, CircularProgress, IconButton, SxProps, ThemeProvider } from '@mui/material';
import {
    Settings as SettingsIcon,
    Undo as UndoIcon,
} from '@mui/icons-material';

import SettingsDialog from '@components/SettingsDialog';
import FilePicker from '@components/FilePicker';
import FileViewer from '@components/FileViewer';
import useStore from '@hooks/useStore';
import {
    getEnabledExtensions,
    handleSharedBufferReceived,
    handleWebMessage,
    IWebView2,
} from '@utils/webview2Helpers';

import useTheme from './theme';

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
    const theme = useTheme();
    const fileContent = useStore((state) => state.fileContent);
    const fileName = useStore((state) => state.fileName);
    const showConfig = useStore((state) => state.showConfig);
    const initState = useStore((state) => state.actions.init);
    // MS webview2
    const webview: IWebView2 | undefined = (window as any).chrome?.webview;
    const isEmbedded = !!webview;

    React.useEffect(() => {
        initState();

        if (isEmbedded) {
            webview.addEventListener('sharedbufferreceived', handleSharedBufferReceived);
            webview.addEventListener('message', handleWebMessage);
            webview.postMessage('AppReadyForData');
            const extensions = getEnabledExtensions().join(',');
            webview.postMessage(extensions);
        }
        return () => {
            if (isEmbedded) {
                webview.removeEventListener('sharedbufferreceived', handleSharedBufferReceived);
                webview.removeEventListener('message', handleWebMessage);
            }
        }
    }, []);

    const toggleSettings = () => {
        useStore.setState({ showConfig: !showConfig });
    };

    const resetFile = () => {
        useStore.setState({ fileName: '', fileSize: 0, fileContent: null });
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {fileContent === null &&  (
                <>
                    {(isEmbedded || fileName) ? (
                        <Box sx={classes.root}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <FilePicker />
                    )}
                </>
            )}
            {fileContent !== null && (
                <FileViewer />
            )}
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
