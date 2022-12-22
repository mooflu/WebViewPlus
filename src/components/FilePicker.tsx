/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Button, Input, SxProps } from '@mui/material';

import useStore from '@hooks/useStore';
import { log } from '@utils/log';

const classes = {
    root: {
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    } as SxProps,
    button: {
        margin: '4rem',
        padding: '4rem',
        height: '20rem',
        borderRadius: '1rem',
        border: '1px dashed #888',
        textTransform: 'none',
        fontSize: '2rem',
    } as SxProps,
    filePicker: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        opacity: 0,
        '& .MuiInput-input': {
            position: 'absolute',
            height: '100%',
            cursor: 'pointer',
        },
    } as SxProps,
};

const FILE_BUTTON_ID = 'raised-button-file';

const FilePicker: React.FC = () => {
    const { t } = useTranslation();

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
                log('File content not supported');
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
                ext === 'xls' ||
                ext === 'ods' ||
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
        <Box component="div" sx={classes.root}>
            <label htmlFor={FILE_BUTTON_ID}>
                <Button
                    sx={classes.button}
                    variant="outlined"
                >
                    <Input
                        inputProps={{ id: FILE_BUTTON_ID }}
                        sx={classes.filePicker}
                        type="file"
                        onChange={handleOpen}
                    />
                    {t('SelectOrDnDFile')}
                </Button>
            </label>
        </Box>
    );
};

export default FilePicker;
