import React from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import math from 'remark-math';
import Tex from '@matejmazur/react-katex';
import 'katex/dist/katex.min.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs as codeStyle } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { IPlugin } from './PluginInterface';
import useStore from '@hooks/useStore';

// https://github.com/remarkjs/remark/blob/main/doc/plugins.md
const renderers = {
    inlineMath: ({ value }: { value: string | number }) => {
        return <Tex block>{value}</Tex>;
    },
    math: ({ value }: { value: string | number }) => {
        return <Tex block>{value}</Tex>;
    },
    code: ({ language, value }: { language: string; value: string }) => {
        return (
            <SyntaxHighlighter
                language={language}
                style={codeStyle}
                wrapLines
                lineProps={{
                    data: 'textLine', // className doesn't work :(
                }}
                showLineNumbers
            >
                {value}
            </SyntaxHighlighter>
        );
    },
};

const MarkdownViewer: React.FC = () => {
    const fileContent = useStore((state) => state.fileContent) as string;

    return (
        <ReactMarkdown
            plugins={[math, gfm]}
            renderers={renderers}
            children={fileContent}
        />
    );
};

export class MarkdownPlugin implements IPlugin {
    public shortName = 'md';
    public name = 'Markdown';
    public extensions = new Set<string>();
    public viewer = (<MarkdownViewer />);

    constructor() {
        this.extensions.add('md');
        this.extensions.add('markdown');
    }
}
