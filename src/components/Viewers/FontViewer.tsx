import React from 'react';
import { useTranslation } from 'react-i18next';
import * as opentype from 'opentype.js';

import {
    Box,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableRow,
    TableCell,
    TextField,
    Typography,
    SxProps,
} from '@mui/material';
import {
    Close as CloseIcon,
    Edit as EditIcon,
    SettingsBackupRestore as RestoreIcon,
} from '@mui/icons-material';

import useStore, { DEFAULT_FONTTEXT } from '@hooks/useStore';

const classes = {
    infoContainer: {
        position: 'absolute',
        right: '0.3rem',
        top: '0.5rem',
        zIndex: 10,
        opacity: 0.6,
        p: 0.5,
        overflow: 'auto',
        maxWidth: '30rem',
        maxHeight: 'calc(100% - 4rem)',
    },
} satisfies Record<string, SxProps>;

interface NameProp {
    name: string;
    value: any;
}

const FontViewer: React.FC = () => {
    const { t } = useTranslation();
    const fileUrl = useStore(state => state.fileUrl);
    const fileContent = useStore(state => state.fileContent);
    const fontText = useStore(state => state.fontText);
    const setFontText = useStore(state => state.actions.setFontText);
    const [fontInfo, setFontInfo] = React.useState<NameProp[] | null>(null);
    const [showEdit, setShowEdit] = React.useState(false);

    React.useEffect(() => {
        try {
            // Note: opentype.js does not support woff2 directly. Needs decompression...
            const font = opentype.parse(fileContent);
            const nameTable = font.tables.name;
            const properties = Object.keys(nameTable).sort();
            const nameProps: NameProp[] = [];
            properties.forEach(name => nameProps.push({
                name,
                value: nameTable[name],
            }));
            setFontInfo(nameProps);
        } catch (ex) {
            setFontInfo(null);
        }
    }, [fileContent]);

    const updateFontText = (fontText: string) => {
        setFontText(fontText);
    };

    const restoreDefaultText = () => {
        setFontText(DEFAULT_FONTTEXT);
    };

    const toggleEdit = () => {
        setShowEdit(!showEdit);
    };

    return (
        <Box
            component="div"
            sx={{
                '@font-face': {
                    fontFamily: 'previewFont',
                    src: `url(${fileUrl})`,
                },
                p: 1.5,
            }}
        >
            {!showEdit && (
                <IconButton onClick={toggleEdit} title={t('EditText')} sx={{ mb: 1 }}>
                    <EditIcon sx={{ width: '1rem', height: '1rem' }} />
                </IconButton>
            )}
            {showEdit && (
                <Paper elevation={4} sx={{ width: '50%', position: 'relative', mb: 1 }}>
                    <TextField
                        variant="standard"
                        fullWidth
                        value={fontText}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            updateFontText(event.target.value);
                        }}
                        onBlur={toggleEdit}
                    />
                    <Box component="div" sx={{ position: 'absolute', top: 0, right: 0 }}>
                        <IconButton onClick={restoreDefaultText} title={t('ResetText')}>
                            <RestoreIcon sx={{ width: '1rem', height: '1rem' }} />
                        </IconButton>
                        <IconButton onClick={toggleEdit} title={t('Close')}>
                            <CloseIcon sx={{ width: '1rem', height: '1rem' }} />
                        </IconButton>
                    </Box>
                </Paper>
            )}

            {[0.5, 0.7, 1, 1.2, 1.5, 2, 3, 5].map(fs => (
                <Typography key={`fs-${fs}`} sx={{ fontFamily: 'previewFont', fontSize: `${fs}rem` }}>
                    {fontText}
                </Typography>
            ))}
            <Paper
                elevation={4}
                sx={classes.infoContainer}
            >
                {fontInfo ? (
                    <Table size="small">
                        <TableBody>
                            {fontInfo.map((field) => {
                                // opentype name table values are per language
                                // try en and fallback to first language found
                                const fieldValue = field.value.en
                                    ? field.value.en
                                    : field.value[Object.keys(field.value)[0]];
                                return (
                                    <TableRow key={field.name}>
                                        <TableCell sx={{ fontSize: '0.7rem', p: 0, pr: '0.5rem' }}>{field.name}</TableCell>
                                        <TableCell sx={{ fontSize: '0.7rem', p: 0 }}>{fieldValue}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                ) : (
                    <Typography sx={{ px: 1, m: 0 }}>{t('NoFontInfoAvailable')}</Typography>
                )}
            </Paper>
        </Box>
    );
};

export default FontViewer;
