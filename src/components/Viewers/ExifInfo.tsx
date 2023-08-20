import React from 'react';
import ExifReader from 'exifreader';

import {
    IconButton,
    Paper,
    SxProps,
    Table,
    TableBody,
    TableRow,
    TableCell,
    Tooltip,
} from '@mui/material';
import {
    Info as InfoIcon,
    Close as CloseIcon,
} from '@mui/icons-material';

import useStore from '@hooks/useStore';

interface ValueTagWithName extends ExifReader.ValueTag {
    name: string;
}

const getDescription = (tag: ValueTagWithName) => {
    if (Array.isArray(tag)) {
        return tag.map(item => item.description).join(', ');
    }
    return tag.description;
};

const classes = {
    infoContainer: {
        position: 'absolute',
        right: '0.3rem',
        top: '2.8rem',
        zIndex: 10,
        opacity: 0.6,
        p: 0.5,
        overflow: 'auto',
        maxWidth: '20rem',
        maxHeight: 'calc(100% - 6.4rem)',
    },
} satisfies Record<string, SxProps>;

interface ExifInfoProps {
    tags: ExifReader.Tags;
}

const ExifInfo: React.FC<ExifInfoProps> = (props) => {
    const openExifPanel = useStore(state => state.openExifPanel);

    const tagList: ValueTagWithName[] = [];
    for (const [key, value] of Object.entries(props.tags)) {
        tagList.push({ ...value, name: key });
    }

    const toggleInfoPanel = () => {
        useStore.setState({ openExifPanel: !openExifPanel });
    };

    const infoTable = (
        <Table size="small">
            <TableBody>
                {tagList.map((tag) => {
                    return (
                        <TableRow key={tag.name}>
                            <TableCell sx={{ fontSize: '0.7rem', p: 0, pr: '0.5rem' }}>{tag.name}</TableCell>
                            <TableCell sx={{ fontSize: '0.7rem', p: 0 }}>{getDescription(tag)}</TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );

    if (!openExifPanel) {
        return (
            <Tooltip
                title={infoTable}
                leaveDelay={250}
                componentsProps={{
                    popper: { sx: { ...classes.infoContainer, maxHeight: 'calc(100% - 8rem)' } },
                    tooltip: { sx: { mt: '0 !important', mr: '1px' } },
                }}
            >
                <IconButton onClick={toggleInfoPanel} sx={classes.infoContainer}>
                    <InfoIcon sx={{ width: '1rem', height: '1rem' }} />
                </IconButton>
            </Tooltip>
        );
    }

    return (
        <>
            <Paper
                elevation={4}
                sx={classes.infoContainer}
            >
                {openExifPanel && infoTable}
            </Paper>
            <IconButton onClick={toggleInfoPanel} sx={classes.infoContainer}>
                <CloseIcon sx={{ width: '1rem', height: '1rem' }} />
            </IconButton>
        </>
    );
};

export default ExifInfo;
