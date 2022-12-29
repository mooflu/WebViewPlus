import React from 'react';
import { useTranslation } from 'react-i18next';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
    vscDarkPlus,
    vs,
} from 'react-syntax-highlighter/dist/esm/styles/prism';

import { Box, useTheme } from '@mui/material';

import * as NB from '@components/Jupyter/JupyterCommon';
import MarkdownCell from '@components/Jupyter/MarkdownCell';

interface DataOutputProps {
    data: NB.Data;
}

const ImageMimeType = [
    'image/png',
    'image/webp',
    'image/jpeg',
    'image/gif',
    'image/bmp',
];

const DataOutput: React.FC<DataOutputProps> = (props) => {
    const { t } = useTranslation();
    const { data } = props;
    const style = (window.matchMedia('(prefers-color-scheme: light)').matches) ? vs : vscDarkPlus;

    for (const mimeType of ImageMimeType) {
        const imageData = data[mimeType] as string;
        if (imageData) {
            const src = `data:${mimeType};base64,${imageData}`;
            return (
                <img src={src} alt="" />
            );
        }
    }
    if (data['image/svg+xml']) {
        const html = NB.joinData(data['image/svg+xml']);
        return (
            <Box component="div" dangerouslySetInnerHTML={{ __html: html }} />
        );
    }
    if (data['text/html']) {
        const html = NB.joinData(data['text/html']);
        return (
            <Box
                component="div"
                className="markdown-body"
                sx={{
                    backgroundColor: 'initial',
                    '& img': {
                        backgroundColor: 'initial',
                    },
                }}
                dangerouslySetInnerHTML={{ __html: html }}
            />
        );
    }
    if (data['text/latex']) {
        const latex = NB.joinData(data['text/latex']);
        const cell: NB.MarkdownCell = {
            cell_type: NB.CellType.Markdown,
            source: latex,
            metadata: {},
        };
        return (
            <MarkdownCell cell={cell} />
        );
    }
    if (data['application/javascript']) {
        const code = NB.joinData(data['application/javascript']);
        return (
            <SyntaxHighlighter
                language="javascript"
                style={style}
                wrapLines
                lineProps={{
                    data: 'textLine', // className doesn't work :(
                }}
            >
                {code}
            </SyntaxHighlighter>
        );
    }
    if (data['text/plain']) {
        const text = NB.joinData(data['text/plain']);
        return <pre>{text}</pre>;
    }

    return (
        <pre>
            {t('UnsupportedDataType')}
            {JSON.stringify(data, null, 2)}
        </pre>
    );
};

interface StreamOutputProps {
    output: NB.StreamOutput;
}

const StreamOutput: React.FC<StreamOutputProps> = (props) => {
    const { output } = props;
    return (
        <pre>{NB.joinData(output.text)}</pre>
    );
};

interface ErrorOutputProps {
    output: NB.ErrorOutput;
}

const ErrorOutput: React.FC<ErrorOutputProps> = (props) => {
    const { output } = props;
    const theme = useTheme();
    // eslint-disable-next-line no-control-regex
    const stripAnsiSeq = /\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g;
    return (
        <Box component="pre" sx={{ color: `${theme.palette.error.main} !important` }}>
            {output.traceback.join('\n').replace(stripAnsiSeq, '')}
        </Box>
    );
};

interface ExecuteResultOutputProps {
    output: NB.ExecuteResultOutput;
}

const ExecuteResultOutput: React.FC<ExecuteResultOutputProps> = (props) => {
    const { output } = props;
    return (
        <DataOutput data={output.data} />
    );
};

interface DisplayDataOutputProps {
    output: NB.DisplayDataOutput;
}

const DisplayDataOutput: React.FC<DisplayDataOutputProps> = (props) => {
    const { output } = props;
    return (
        <DataOutput data={output.data} />
    );
};

interface CodeCellProps {
    cell: NB.CodeCell;
    lang: string;
}

const CodeCell: React.FC<CodeCellProps> = (props) => {
    const { cell, lang } = props;
    const theme = useTheme();
    const style = (window.matchMedia('(prefers-color-scheme: light)').matches) ? vs : vscDarkPlus;
    const code = NB.joinData(cell.source);

    return (
        <Box component="div">
            <SyntaxHighlighter
                language={lang}
                style={style}
                customStyle={{
                    padding: '0.5rem',
                    borderRadius: '0.2rem',
                    border: `1px solid ${theme.palette.background.paper}`,
                }}
                wrapLines
                lineProps={{
                    data: 'textLine', // className doesn't work :(
                }}
            >
                {code}
            </SyntaxHighlighter>
            {cell.outputs && cell.outputs.map((output, i) => {
                return (
                    // eslint-disable-next-line react/no-array-index-key
                    <Box key={`output-${i}`} component="div">
                        <>
                            {{
                                [NB.OutputType.Stream]: <StreamOutput
                                    output={output as NB.StreamOutput}
                                />,
                                [NB.OutputType.Error]: <ErrorOutput
                                    output={output as NB.ErrorOutput}
                                />,
                                [NB.OutputType.ExecuteResult]: <ExecuteResultOutput
                                    output={output as NB.ExecuteResultOutput}
                                />,
                                [NB.OutputType.DisplayData]: <DisplayDataOutput
                                    output={output as NB.DisplayDataOutput}
                                />,
                            }[output.output_type]}
                        </>
                    </Box>
                );
            })}
        </Box>
    );
};

export default CodeCell;
