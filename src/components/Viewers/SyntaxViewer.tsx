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
    const pluginByShortName = useStore(state => state.pluginByShortName);
    const plugin = pluginByShortName.syntax;

    const matchedExtra = plugin.extraExtensions.filter(e => e.split(':')[0] === fileExt);
    let lang = fileExt;
    if (matchedExtra.length > 0) {
        // e.g. rs:rust
        const extAndLang = matchedExtra[0].split(':');
        lang = (extAndLang.length === 1) ? extAndLang[0] : extAndLang[1];
    } else {
        lang = Ext2Lang[fileExt] || fileExt;
    }

    const style = window.matchMedia('(prefers-color-scheme: light)').matches ? vs : vscDarkPlus;
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
                background: 'initial',
            }}
        >
            {fileContent}
        </SyntaxHighlighter>
    );
};

export default SyntaxViewer;
