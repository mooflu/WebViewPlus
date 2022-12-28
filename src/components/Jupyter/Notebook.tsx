import React from 'react';

import { Box, useTheme } from '@mui/material';

import * as NB from '@components/Jupyter/JupyterTypes';
import CodeCell from '@components/Jupyter/CodeCell';
import MarkdownCell from '@components/Jupyter/MarkdownCell';
import RawCell from '@components/Jupyter/RawCell';

interface NotebookProps {
    nb: NB.Notebook;
}

const Notebook: React.FC<NotebookProps> = (props) => {
    const { nb } = props;
    const theme = useTheme();

    if (nb.nbformat < 4) {
        return <>Unsupported version</>;
    }

    const lang = nb.metadata.kernelspec.language || nb.metadata.kernelspec.name;

    return (
        <Box component="div" sx={{ margin: '1rem' }}>
            {nb.cells.map((c, i) => {
                const cellBlockLabel = (c as NB.CodeCell).execution_count ? `[${(c as NB.CodeCell).execution_count}]` : '';
                return (
                    // eslint-disable-next-line react/no-array-index-key
                    <Box key={`cell-${i}`} component="div" sx={{ display: 'flex' }}>
                        <Box
                            component="div"
                            sx={{
                                fontSize: '0.7rem',
                                opacity: 0.5,
                                flex: '0 0 3rem',
                                borderRadius: '0.2rem',
                                margin: '0.5rem',
                                padding: '0.2rem',
                                textAlign: 'right',
                                color: theme.palette.grey[500],
                                // backgroundColor: theme.palette.background.paper,
                            }}
                        >
                            {cellBlockLabel}
                        </Box>
                        <Box component="div" sx={{ flex: '1 1 100%' }}>
                            {{
                                [NB.CellType.Code]: <CodeCell cell={c as NB.CodeCell} lang={lang} />,
                                [NB.CellType.Markdown]: <MarkdownCell cell={c as NB.MarkdownCell} />,
                                [NB.CellType.Raw]: <RawCell cell={c as NB.RawCell} />,
                            }[c.cell_type]}
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
};

export default Notebook;
