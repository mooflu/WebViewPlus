import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
    vscDarkPlus,
    vs,
} from 'react-syntax-highlighter/dist/esm/styles/prism';

import { IPlugin } from './PluginInterface';
import useStore from '@hooks/useStore';

// TODO: add more - see https://prismjs.com/#supported-languages
const Ext2Lang: { [index: string]: string } = {
    'c++': 'cpp',
    'h++': 'cpp',
    bat: 'batch',
    c: 'c',
    cmake: 'cmake',
    cpp: 'cpp',
    cs: 'csharp',
    css: 'css',
    go: 'go',
    h: 'c',
    hpp: 'cpp',
    html: 'html',
    java: 'java',
    js: 'javascript',
    json: 'json',
    jsx: 'jsx',
    lua: 'lua',
    md: 'markdown',
    perl: 'perl',
    pl: 'perl',
    ps1: 'powershell',
    psm1: 'powershell',
    py: 'python',
    rb: 'ruby',
    sass: 'sass',
    scss: 'scss',
    sh: 'bash',
    sql: 'sql',
    svg: 'svg',
    tex: 'latex',
    ts: 'typescript',
    tsx: 'tsx',
    txt: 'plain',
    yaml: 'yaml',
    yml: 'yaml',
};

const SyntaxViewer: React.FC = () => {
    const fileContent = useStore((state) => state.fileContent) as string;
    const fileExt = useStore((state) => state.fileExt);

    const lang = Ext2Lang[fileExt];

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

export class SyntaxPlugin implements IPlugin {
    public shortName = 'syntax';
    public name = 'Syntax highlighter';
    public extensions = new Set<string>();
    public viewer = (<SyntaxViewer />);

    constructor() {
        for (const ext in Ext2Lang) {
            this.extensions.add(ext);
        }
    }
}
