import React from 'react';

import { CssBaseline, Box, CircularProgress, IconButton, SxProps, ThemeProvider } from '@mui/material';
import {
    Settings as SettingsIcon,
    Undo as UndoIcon,
} from '@mui/icons-material';

import SettingsDialog from '@components/Settings/SettingsDialog';
import FilePicker from '@components/FilePicker';
import FileViewer from '@components/Viewers/FileViewer';
import useStore from '@hooks/useStore';
import {
    handleSharedBufferReceived,
    handleWebMessage,
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
    const webview = useStore(state => state.webview);
    const fileContent = useStore(state => state.fileContent);
    const fileName = useStore(state => state.fileName);
    const showConfig = useStore(state => state.showConfig);
    const initState = useStore(state => state.actions.init);

    React.useEffect(() => {
        initState();

        if (webview) {
            webview.addEventListener('sharedbufferreceived', handleSharedBufferReceived);
            webview.addEventListener('message', handleWebMessage);
            webview.postMessage({ command: 'AppReadyForData', data: null });
        }
        return () => {
            if (webview) {
                webview.removeEventListener('sharedbufferreceived', handleSharedBufferReceived);
                webview.removeEventListener('message', handleWebMessage);
            }
        };
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
            {fileContent === null && (
                <>
                    {(webview || fileName) ? (
                        <Box component="div" sx={classes.root}>
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
            {!webview && fileName && (
                <IconButton sx={[classes.floatButton, classes.resetButton] as SxProps} onClick={resetFile}>
                    <UndoIcon />
                </IconButton>
            )}

            <SettingsDialog />
        </ThemeProvider>
    );
};

export default App;
