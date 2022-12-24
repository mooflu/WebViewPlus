import React from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import i18n from 'i18next';

import {
    Alert,
    CssBaseline,
    Box,
    Button,
    CircularProgress,
    IconButton,
    Snackbar,
    SxProps,
    ThemeProvider,
    Typography,
} from '@mui/material';
import {
    Settings as SettingsIcon,
    Block as NotAllowedIcon,
    Undo as UndoIcon,
} from '@mui/icons-material';

import SettingsDialog from '@components/Settings/SettingsDialog';
import FilePicker from '@components/FilePicker';
import FileViewer from '@components/Viewers/FileViewer';
import useStore from '@hooks/useStore';
import {
    handleSharedBufferReceived,
} from '@utils/webview2Helpers';
import { log } from '@utils/log';

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
    errorComponent: {
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
};

const CatchGlobalError: React.FC = () => {
    const [globalError, setGlobalError] = React.useState<any>(null);
    if (globalError) {
        throw globalError; // re-throw error in react context so ErrorBoundary can catch and handle
    }

    const handleError = (e: ErrorEvent) => {
        setGlobalError(e.error);
    };

    React.useEffect(() => {
        window.addEventListener('error', handleError);
        return () => {
            window.removeEventListener('error', handleError);
        };
    }, []);

    return <></>;
};

const ErrorFallback: React.FC<FallbackProps> = (props) => {
    const { t } = useTranslation();
    const [disabled, setDisabled] = React.useState(false);

    const onReload = () => {
        setDisabled(true);
        window.location.reload();
    };

    return (
        <Box component="div" sx={classes.errorComponent}>
            <Typography variant="h5" sx={{ mb: '1rem' }}>{t('SomethingWentWrong')}</Typography>
            <Typography variant="body2" sx={{ mb: '1rem' }}>{t('AppError')} {props.error.message}</Typography>
            <Button variant="contained" disabled={disabled} onClick={onReload}>{t('Reload')}</Button>
        </Box>
    );
};

const App: React.FC = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const webview = useStore(state => state.webview);
    const fileContent = useStore(state => state.fileContent);
    const fileName = useStore(state => state.fileName);
    const showConfig = useStore(state => state.showConfig);
    const initState = useStore(state => state.actions.init);
    const unload = useStore(state => state.actions.unload);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);

    React.useEffect(() => {
        initState();

        const handleWebMessage = (e: MessageEvent<string>) => {
            log(`Received handleWebMessage: ${e.data}`);
            if (e.data === 'unload') {
                unload();
            } else if (e.data.startsWith('setLanguage:')) {
                const langCode = e.data.split(':')[1];
                i18n.changeLanguage(langCode);
            } else if (e.data === 'newWindowRejected') {
                setSnackbarOpen(true);
            } else if (e.data === 'frameNavigationRejected') {
                setSnackbarOpen(true);
            }
        };

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
        useStore.getState().actions.unload();
    };

    const onCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <CatchGlobalError />
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
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={onCloseSnackbar}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert onClose={onCloseSnackbar} severity="error" icon={<NotAllowedIcon />}>
                        {t('NavigationRejected')}
                    </Alert>
                </Snackbar>
            </ErrorBoundary>
        </ThemeProvider>
    );
};

export default App;
