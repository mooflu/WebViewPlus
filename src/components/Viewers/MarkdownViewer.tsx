import React from 'react';
import ReactMarkdown from 'react-markdown';
import { HeadingProps } from 'react-markdown/lib/ast-to-react';
import gfm from 'remark-gfm';
import math from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';
import './markdown.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
    vscDarkPlus,
    vs,
} from 'react-syntax-highlighter/dist/esm/styles/prism';

import { Box, ListItem, List, Typography } from '@mui/material';

import useStore, { store } from '@hooks/useStore';

const TOC: React.FC = () => {
    const tocItems = useStore(state => state.mdTableOfContentsItems);

    if (tocItems.length === 0) {
        return <></>;
    }

    const minLevel = tocItems.reduce((l, t) => Math.min(l, t.level), 100);
    return (
        <Box
            component="div"
            className="markdown-body"
            sx={{
                flex: '0 0 12rem',
                padding: '1rem',
                height: '100%',
                overflow: 'auto',
                fontSize: '80%',
            }}
        >
            <Typography variant="h2">Contents</Typography>
            <List sx={{ padding: '0 !important', margin: '0' }}>
                {tocItems.map(({ level, id, title }) => (
                    <ListItem
                        key={id}
                        sx={{
                            pl: `${level - minLevel}rem`,
                            pt: 0,
                            pb: 0,
                        }}
                    >
                        <a href={`#${id}`}>•&nbsp;{title}</a>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

const HeaderItem: React.FC<React.PropsWithChildren<HeadingProps>> = (props) => {
    const { children, node } = props;
    const addTableOfContentItem = useStore(state => state.actions.addTableOfContentItem);

    // Based on https://github.com/remarkjs/react-markdown/issues/48#issuecomment-1074699244
    const level = Number(node.tagName.match(/h(\d)/)?.slice(1));
    if (level && children && typeof children[0] === 'string') {
        const id = children[0].toLowerCase().replace(/[^a-z0-9]+/g, '-');
        addTableOfContentItem({
            level,
            id,
            title: children[0],
        });
        return React.createElement(
            node.tagName, { id }, children,
        );
    }

    return React.createElement(props.node.tagName, props, children);
};

const MarkdownViewer: React.FC = () => {
    const fileContent = useStore(state => state.fileContent) as string;

    const RM = React.useMemo(() => {
        store.getState().actions.clearTableOfContent();
        const style = window.matchMedia('(prefers-color-scheme: light)').matches ? vs : vscDarkPlus;

        // This is collecting the TOC data during render (via HeaderItem)
        // Memo so it doesn't re-render (and mess with the TOC data).
        return (
            <ReactMarkdown
                remarkPlugins={[gfm, math]}
                rehypePlugins={[rehypeKatex, rehypeRaw]}
                components={{
                    h2: HeaderItem,
                    h3: HeaderItem,
                    h4: HeaderItem,
                    h5: HeaderItem,
                    h6: HeaderItem,
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
                                wrapLongLines
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
                {fileContent}
            </ReactMarkdown>
        );
    }, [fileContent]);

    return (
        <Box
            component="div"
            sx={{
                display: 'flex',
                height: '100%',
            }}
        >
            <TOC />
            <Box
                component="div"
                className="markdown-body"
                sx={{
                    position: 'relative',
                    flex: '1 1 auto',
                    overflow: 'auto',
                }}
            >
                {RM}
            </Box>
        </Box>
    );
};

export default MarkdownViewer;
