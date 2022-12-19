import React from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import math from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
    vscDarkPlus,
    vs,
} from 'react-syntax-highlighter/dist/esm/styles/prism';

import useStore from '@hooks/useStore';

const MarkdownViewer: React.FC = () => {
    const fileContent = useStore((state) => state.fileContent) as string;

    let style = vs;
    if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
        style = vscDarkPlus;
    }

    return (
        <ReactMarkdown
            remarkPlugins={[math, gfm]}
            rehypePlugins={[rehypeKatex]}
            components={{
                code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return (
                        <SyntaxHighlighter
                            {...props}
                            language={match ? match[1] : ''}
                            style={style}
                            wrapLines
                            lineProps={{
                                data: 'textLine', // className doesn't work :(
                            }}
                            showLineNumbers
                            children={String(children).replace(/\n$/, '')}
                        />
                    );
                },
            }}
            children={fileContent}
        />
    );
};

export default MarkdownViewer;
