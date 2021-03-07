import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import UndoIcon from '@material-ui/icons/Undo';

import SettingsDialog from '@components/SettingsDialog';
import FilePicker from '@components/FilePicker';
import FileViewer from '@components/FileViewer';

import useStore from '@hooks/useStore';
import { initWebview2 } from '@utils/webview2Helpers';

initWebview2();

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
        },
        settingsButton: {
            position: 'fixed',
            bottom: '0.5rem',
            right: '0.5rem',
            backgroundColor: 'white',
            opacity: 0.7,
        },
        resetButton: {
            position: 'fixed',
            bottom: '0.5rem',
            right: '3.5rem',
            backgroundColor: 'white',
            opacity: 0.7,
        },
    })
);

const App: React.FC = () => {
    const classes = useStyles();
    const fileContent = useStore((state) => state.fileContent);
    const fileName = useStore((state) => state.fileName);
    const showConfig = useStore((state) => state.showConfig);
    const initState = useStore((state) => state.actions.init);
    // MS webview2
    const isEmbedded = !!(window as any).chrome?.webview;

    React.useEffect(() => {
        initState();
        if (isEmbedded) {
            const extensions = (window as any).WebviewPlus.getExtensions().join(
                ','
            );
            (window as any).chrome.webview.hostObjects.fileProps.extensions = extensions;
        }
    }, [initState]);

    let pickerOrViewer: JSX.Element;
    if (fileContent === null) {
        if (isEmbedded || fileName) {
            return (
                <div className={classes.root}>
                    <CircularProgress />
                </div>
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
        <>
            {pickerOrViewer}
            <IconButton
                className={classes.settingsButton}
                onClick={toggleSettings}
            >
                <SettingsIcon />
            </IconButton>
            {!isEmbedded && fileName && (
                <IconButton className={classes.resetButton} onClick={resetFile}>
                    <UndoIcon />
                </IconButton>
            )}

            <SettingsDialog />
        </>
    );
};

export default App;
