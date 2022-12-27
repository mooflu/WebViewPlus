import React from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import math from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
    vscDarkPlus,
    vs,
} from 'react-syntax-highlighter/dist/esm/styles/prism';

import { Box } from '@mui/material';

import * as NB from '@components/Jupyter/JupyterTypes';

interface MarkdownCellProps {
    cell: NB.MarkdownCell;
}

const MarkdownCell: React.FC<MarkdownCellProps> = (props) => {
    const { cell } = props;
    const style = window.matchMedia('(prefers-color-scheme: dark)').matches ? vscDarkPlus : vs;
    const cellContent = Array.isArray(cell.source)
        ? cell.source.join('')
        : cell.source;

    return (
        <Box component="div" className="markdown-body" sx={{ backgroundColor: 'initial' }}>
            <ReactMarkdown
                remarkPlugins={[gfm, math]}
                rehypePlugins={[rehypeKatex, rehypeRaw]}
                components={{
                    code({ node, inline, className, children, ...props }) {
                        if (inline) {
                            return (
                                <Box component="code">
                                    {String(children).replace(/\n$/, '')}
                                </Box>
                            );
                        }
                        const match = /language-(\w+)/.exec(className || '');
                        return (
                            <SyntaxHighlighter
                                {...props}
                                language={match ? match[1] : ''}
                                style={style}
                                useInlineStyles={false}
                                wrapLines
                                lineProps={{
                                    data: 'textLine', // className doesn't work :(
                                }}
                                PreTag="span"
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        );
                    },
                }}
            >
                {cellContent}
            </ReactMarkdown>
        </Box>
    );
};

export default MarkdownCell;
