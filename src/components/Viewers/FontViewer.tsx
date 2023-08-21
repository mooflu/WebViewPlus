import React from 'react';
import { useTranslation } from 'react-i18next';
import * as opentype from 'opentype.js';

import {
    Box,
    Paper,
    Table,
    TableBody,
    TableRow,
    TableCell,
    Typography,
    SxProps,
} from '@mui/material';

import useStore from '@hooks/useStore';

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
    const [fontInfo, setFontInfo] = React.useState<NameProp[] | null>(null);

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
            {[0.5, 0.7, 1, 1.2, 1.5, 2, 3, 5].map(fs => (
                <Typography key={`fs-${fs}`} sx={{ fontFamily: 'previewFont', fontSize: `${fs}rem` }}>
                    The quick brown fox jumps over the lazy dog
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
