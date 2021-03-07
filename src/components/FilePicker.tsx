import React from 'react';

import { Button } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import useStore from '@hooks/useStore';
import { log } from '@utils/log';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
        },
        button: {
            padding: '4rem',
            height: '20rem',
            borderRadius: '1rem',
            border: '1px dashed #888',
            textTransform: 'none',
        },
        label: {
            fontSize: '2rem',
        },
        filePicker: {
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
        },
    })
);

const FilePicker: React.FC = () => {
    const classes = useStyles();

    const handledDataLoaded = (e: ProgressEvent<FileReader>) => {
        if (e?.target?.result) {
            log(`handledDataLoaded: size: ${e.total}`);
            const content = e.target.result;
            if (typeof content === 'string') {
                useStore.setState({ fileContent: content, fileSize: e.total });
            } else if (content instanceof ArrayBuffer) {
                useStore.setState({
                    fileContent: content,
                    fileSize: e.total,
                });
            } else {
                console.error('File content not supported');
            }
        }
    };

    const handleOpen = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e?.target?.files) {
            const file = e.target.files[0];
            log(`handleOpen: ${file.name}`);
            const ext = file.name.split('.').pop()?.toLocaleLowerCase() || '';

            const url = URL.createObjectURL(file); // returns a blob url - won't expose local file system location
            const fileReader = new FileReader();
            fileReader.onloadend = handledDataLoaded;
            if (
                ext === 'xlsx' ||
                ext === 'gltf' ||
                ext === 'glb' ||
                ext === 'pdf' ||
                ext === 'webp'
            ) {
                fileReader.readAsArrayBuffer(file);
            } else {
                fileReader.readAsText(file);
            }
            useStore.setState({
                fileName: file.name,
                fileExt: ext,
                fileUrl: url,
            });
        }
    };

    return (
        <div className={classes.root}>
            <label htmlFor='raised-button-file'>
                <Button
                    classes={{ root: classes.button, label: classes.label }}
                    variant='outlined'
                >
                    <input
                        className={classes.filePicker}
                        id='raised-button-file'
                        type='file'
                        onChange={handleOpen}
                    />
                    Select or drag and drop file here.
                </Button>
            </label>{' '}
        </div>
    );
};

export default FilePicker;
