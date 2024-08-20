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
    useMediaQuery,
} from '@mui/material';
import {
    Settings as SettingsIcon,
    Block as NotAllowedIcon,
    Undo as UndoIcon,
} from '@mui/icons-material';

import SettingsDialog from '@components/Settings/SettingsDialog';
import FilePicker from '@components/FilePicker';
import FileViewer from '@components/Viewers/FileViewer';
import YingYangIcon from '@components/icons/YingYang';
import useStore from '@hooks/useStore';
import {
    handleSharedBufferReceived,
} from '@utils/webview2Helpers';
import { log } from '@utils/log';
import { openFile } from '@utils/openFile';
import { InitData } from '@utils/types';

import useTheme from './theme';

const classes = {
    root: {
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    floatButtonsHidden: {
        opacity: '0',
        transition: 'opacity 0.5s linear',
    },
    floatButtons: {
        display: 'flex',
        flexDirection: 'row',
        position: 'fixed',
        bottom: '0.5rem',
        right: '0.5rem',
    },
    floatButton: {
        ml: '0.5rem',
        opacity: 0.7,
    },
    errorComponent: {
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
} satisfies Record<string, SxProps>;

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
    const showSettings = useStore(state => state.showSettings);
    const yingYang = useStore(state => state.yingYang);
    const initState = useStore(state => state.actions.init);
    const unload = useStore(state => state.actions.unload);
    const setDetectEncoding = useStore(state => state.actions.setDetectEncoding);
    const setShowTrayIcon = useStore(state => state.actions.setShowTrayIcon);
    const setUseTransparency = useStore(state => state.actions.setUseTransparency);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [dragInProgress, setDragInProgress] = React.useState(false);
    const [settingsButtonsVisible, setSettingsButtonsVisible] = React.useState(true);
    const systemDark = useMediaQuery('(prefers-color-scheme: dark)');
    const isDark = yingYang ? systemDark : !systemDark;
    const floatButtonContainer = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        initState();

        const handleWebMessage = (e: MessageEvent<string>) => {
            log(`Received handleWebMessage: ${e.data}`);
            if (e.data === 'unload') {
                unload();
            } else if (e.data.startsWith('initData:')) {
                const initDataStr = e.data.substring(9);
                const initData: InitData = JSON.parse(initDataStr);
                i18n.changeLanguage(initData.langCode);
                setDetectEncoding(initData.detectEncoding, { init: true });
                setShowTrayIcon(initData.showTrayIcon, { init: true });
                setUseTransparency(initData.useTransparency, { init: true });
            } else if (e.data === 'newWindowRejected') {
                setSnackbarOpen(true);
            } else if (e.data === 'frameNavigationRejected') {
                setSnackbarOpen(true);
            }
        };

        const body = document.getElementsByTagName('body')[0];
        if (webview) {
            webview.addEventListener('sharedbufferreceived', handleSharedBufferReceived);
            webview.addEventListener('message', handleWebMessage);
            webview.postMessage({ command: 'AppReadyForData', data: null });
        } else {
            body.addEventListener('dragenter', handleDragEnter);
            body.addEventListener('dragover', handleDragOver);
            body.addEventListener('dragleave', handleDragExit);
            body.addEventListener('drop', handleDrop);
        }
        document.addEventListener('pointerenter', makeSettingsButtonsVisible);
        document.addEventListener('keydown', makeSettingsButtonsVisible);

        return () => {
            if (webview) {
                webview.removeEventListener('sharedbufferreceived', handleSharedBufferReceived);
                webview.removeEventListener('message', handleWebMessage);
            } else {
                body.removeEventListener('dragenter', handleDragEnter);
                body.removeEventListener('dragover', handleDragOver);
                body.removeEventListener('dragleave', handleDragExit);
                body.removeEventListener('drop', handleDrop);
            }
            if (floatButtonContainer.current) {
                floatButtonContainer.current.removeEventListener('pointermove', makeSettingsButtonsVisible);
                floatButtonContainer.current.removeEventListener('pointerdown', makeSettingsButtonsVisible);
                floatButtonContainer.current.removeEventListener('keydown', makeSettingsButtonsVisible);
            }
            document.addEventListener('pointerenter', makeSettingsButtonsVisible);
            document.addEventListener('keydown', makeSettingsButtonsVisible);
        };
    }, []);

    React.useEffect(() => {
        if (floatButtonContainer.current) {
            floatButtonContainer.current.addEventListener('pointermove', makeSettingsButtonsVisible);
            floatButtonContainer.current.addEventListener('pointerdown', makeSettingsButtonsVisible);
            floatButtonContainer.current.addEventListener('keydown', makeSettingsButtonsVisible);
        }
    }, [floatButtonContainer]);

    React.useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        useStore.setState({ isDark });
    }, [isDark]);

    React.useEffect(() => {
        if (showSettings) {
            // if a new preview comes in, turn settings dialog off
            useStore.setState({ showSettings: !showSettings });
        }
    }, [fileContent]);

    React.useEffect(() => {
        if (settingsButtonsVisible) {
            const timerId = window.setTimeout(() => {
                setSettingsButtonsVisible(false);
            }, 3000);
            return () => {
                window.clearTimeout(timerId);
            };
        }
        return () => {};
    }, [settingsButtonsVisible]);

    const toggleSettings = () => {
        useStore.setState({ showSettings: !showSettings });
    };

    const toggleYingYang = () => {
        // toggle light/dark mode - useful for items with transparent background
        // where the forground color is the similar to light/dark theme.
        useStore.setState({ yingYang: !yingYang });
    };

    const resetFile = () => {
        useStore.getState().actions.unload();
    };

    const onCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleDrop = (e: DragEvent) => {
        setDragInProgress(false);
        unload();
        if (e.dataTransfer?.items) {
            for (const item of e.dataTransfer.items) {
                if (item.kind === 'file') {
                    const file = item.getAsFile();
                    if (file) {
                        e.preventDefault();
                        openFile(file);
                    }
                }
            }
        }
    };

    const handleDragEnter = (e: DragEvent) => {
        setDragInProgress(true);
        e.preventDefault();
    };

    const handleDragOver = (e: DragEvent) => {
        setDragInProgress(true);
        e.preventDefault();
    };

    const handleDragExit = (e: DragEvent) => {
        setDragInProgress(false);
        e.preventDefault();
    };

    const makeSettingsButtonsVisible = () => {
        setSettingsButtonsVisible(true);
    };

    const floatButtonsStyles: SxProps[] = [classes.floatButtons];
    if (!settingsButtonsVisible) {
        floatButtonsStyles.push(classes.floatButtonsHidden);
    }

    const floatButton = {
        ...classes.floatButton,
        color: isDark ? '#222' : '#888',
        backgroundColor: isDark ? '#ccc' : '#333',
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

                <Box component="div" sx={floatButtonsStyles} ref={floatButtonContainer}>
                    {!webview && fileName && (
                        <IconButton onClick={resetFile} sx={floatButton}>
                            <UndoIcon />
                        </IconButton>
                    )}
                    <IconButton onClick={toggleYingYang} sx={floatButton}>
                        <YingYangIcon />
                    </IconButton>
                    <IconButton onClick={toggleSettings} sx={floatButton}>
                        <SettingsIcon />
                    </IconButton>
                </Box>

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
                <Box
                    component="div"
                    sx={{
                        pointerEvents: 'none',
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: '100%',
                        border: dragInProgress ? `3px dashed ${theme.palette.primary.main}` : '',
                    }}
                />
            </ErrorBoundary>
        </ThemeProvider>
    );
};

export default App;
