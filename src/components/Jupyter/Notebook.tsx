import React from 'react';

import { Box } from '@mui/material';

import * as NB from '@components/Jupyter/JupyterTypes';
import CodeCell from '@components/Jupyter/CodeCell';
import MarkdownCell from '@components/Jupyter/MarkdownCell';
import RawCell from '@components/Jupyter/RawCell';

interface NotebookProps {
    nb: NB.Notebook;
}

const Notebook: React.FC<NotebookProps> = (props) => {
    const { nb } = props;

    if (nb.nbformat < 4) {
        return <>Unsupported version</>;
    }

    const lang = nb.metadata.kernelspec.language || nb.metadata.kernelspec.name;

    return (
        <Box component="div" sx={{ margin: '1rem' }}>
            {nb.cells.map((c, i) => {
                return (
                    // eslint-disable-next-line react/no-array-index-key
                    <Box key={`cell-${i}`} component="div">
                        {{
                            [NB.CellType.Code]: <CodeCell cell={c as NB.CodeCell} lang={lang} />,
                            [NB.CellType.Markdown]: <MarkdownCell cell={c as NB.MarkdownCell} />,
                            [NB.CellType.Raw]: <RawCell cell={c as NB.RawCell} />,
                        }[c.cell_type]}
                    </Box>
                );
            })}
        </Box>
    );
};

export default Notebook;
