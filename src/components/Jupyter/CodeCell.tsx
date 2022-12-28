import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
    vscDarkPlus,
    vs,
} from 'react-syntax-highlighter/dist/esm/styles/prism';

import { Box, useTheme } from '@mui/material';

import * as NB from '@components/Jupyter/JupyterTypes';
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
    const { data } = props;
    let style = vs;
    if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
        style = vscDarkPlus;
    }

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
        const svgData = data['image/svg+xml'];
        const html = Array.isArray(svgData)
            ? svgData.join('')
            : svgData;

        return (
            <Box component="div" dangerouslySetInnerHTML={{ __html: html }} />
        );
    }
    if (data['text/html']) {
        const html = data['text/html'];
        return (
            <Box
                component="div"
                className="markdown-body"
                sx={{ backgroundColor: 'initial' }}
                dangerouslySetInnerHTML={{ __html: html }}
            />
        );
    }
    if (data['text/latex']) {
        const latex = data['text/latex'] as string;
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
        const code = data['application/javascript'];
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
        return <pre>{data['text/plain']}</pre>;
    }

    return (
        <pre>
            Unsupported data type:
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
        <pre>{output.text.join('')}</pre>
    );
};

interface ErrorOutputProps {
    output: NB.ErrorOutput;
}

const ErrorOutput: React.FC<ErrorOutputProps> = (props) => {
    const { output } = props;
    return (
        <>{output.ename}</>
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

    let style = vs;
    if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
        style = vscDarkPlus;
    }

    const code = Array.isArray(cell.source)
        ? cell.source.join('')
        : cell.source;

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
