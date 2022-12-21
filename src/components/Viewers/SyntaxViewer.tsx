import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
    vscDarkPlus,
    vs,
} from 'react-syntax-highlighter/dist/esm/styles/prism';

import useStore from '@hooks/useStore';
import { Ext2Lang } from '@plugins/SyntaxPlugin';

const SyntaxViewer: React.FC = () => {
    const fileContent = useStore(state => state.fileContent) as string;
    const fileExt = useStore(state => state.fileExt);

    const lang = Ext2Lang[fileExt] || fileExt;

    let style = vs;
    if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
        style = vscDarkPlus;
    }
    // console.log(SyntaxHighlighter.supportedLanguages);

    return (
        <SyntaxHighlighter
            language={lang}
            style={style}
            wrapLines
            lineProps={{
                data: 'textLine', // className doesn't work :(
            }}
            showLineNumbers
            customStyle={{
                margin: 0,
                padding: 0,
                border: 'none',
                overflow: 'initial',
            }}
        >
            {fileContent}
        </SyntaxHighlighter>
    );
};

export default SyntaxViewer;
