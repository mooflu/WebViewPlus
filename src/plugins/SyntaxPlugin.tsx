import React from 'react';

import SyntaxViewerSettings from '@components/Settings/SyntaxViewerSettings';

import { IPlugin, ViewerType } from './PluginInterface';

// TODO: add more - see https://prismjs.com/#supported-languages
export const Ext2Lang: { [index: string]: string } = {
    'c++': 'cpp',
    'h++': 'cpp',
    bat: 'batch',
    c: 'c',
    cmake: 'cmake',
    cpp: 'cpp',
    cs: 'csharp',
    css: 'css',
    d: 'd',
    go: 'go',
    h: 'c',
    hpp: 'cpp',
    html: 'html',
    ini: 'ini',
    java: 'java',
    js: 'javascript',
    json: 'json',
    jsx: 'jsx',
    kt: 'kotlin',
    lua: 'lua',
    m: 'objectivec',
    mm: 'objectivec',
    makefile: 'makefile',
    md: 'markdown',
    pas: 'pascal',
    perl: 'perl',
    php: 'php',
    pl: 'perl',
    ps1: 'powershell',
    psm1: 'powershell',
    py: 'python',
    r: 'r',
    rb: 'ruby',
    rs: 'rust',
    sass: 'sass',
    scss: 'scss',
    sh: 'bash',
    scala: 'scala',
    sql: 'sql',
    svg: 'svg',
    swift: 'swift',
    tex: 'latex',
    ts: 'typescript',
    tsx: 'tsx',
    txt: 'plain',
    xml: 'xml',
    yaml: 'yaml',
    yml: 'yaml',
};

export class SyntaxPlugin implements IPlugin {
    public shortName = 'syntax';
    public viewerType = ViewerType.Syntax;
    public enabled = true;
    public extraExtensions: string[] = [];
    public extensions: { [index: string]: boolean } = {};
    public customSettings = <SyntaxViewerSettings />;

    constructor() {
        for (const ext in Ext2Lang) {
            if ({}.hasOwnProperty.call(Ext2Lang, ext)) {
                this.extensions[ext] = true;
            }
        }
    }
}
