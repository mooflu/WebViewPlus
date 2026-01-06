import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
    vscDarkPlus,
    vs,
} from 'react-syntax-highlighter/dist/esm/styles/prism';

import { Box, SxProps } from '@mui/material';

import useStore from '@hooks/useStore';
import { Ext2Lang } from '@plugins/SyntaxPlugin';

const SyntaxViewer: React.FC = () => {
    const fileContent = useStore(state => state.fileContent) as string;
    const fileExt = useStore(state => state.fileExt);
    const syntaxShowLineNumbers = useStore(state => state.syntaxShowLineNumbers);
    const syntaxWrapLines = useStore(state => state.syntaxWrapLines);
    const pluginByShortName = useStore(state => state.pluginByShortName);
    const syntaxFontSize = useStore(state => state.syntaxFontSize);
    const syntaxCustomFont = useStore(state => state.syntaxCustomFont);
    const isDark = useStore(state => state.isDark);
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

    const style = isDark ? vscDarkPlus : vs;

    const fontFaceSx: SxProps = syntaxCustomFont
        ? {
            '@font-face': {
                fontFamily: 'syntaxFont',
                src: syntaxCustomFont,
            },
        } : {};

    return (
        <Box
            component="div"
            sx={fontFaceSx}
        >
            <SyntaxHighlighter
                language={lang}
                style={style}
                wrapLines
                wrapLongLines={syntaxWrapLines}
                lineProps={{
                    className: syntaxWrapLines ? 'textLine textLineNumber' : 'textLineNoWrap textLineNumber',
                    style: {
                        fontFamily: syntaxCustomFont ? 'syntaxFont' : '',
                        fontSize: syntaxFontSize,
                        lineHeight: '1.2em',
                        marginLeft: syntaxShowLineNumbers ? '3.1em' : 0,
                    },
                }}
                customStyle={{
                    margin: 0,
                    padding: 0,
                    border: 'none',
                    overflow: 'initial',
                    // background: 'initial',
                    counterReset: 'linenumber',
                }}
            >
                {fileContent}
            </SyntaxHighlighter>
        </Box>
    );
};

export default SyntaxViewer;
