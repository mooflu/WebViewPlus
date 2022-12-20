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

export class SyntaxPlugin implements IPlugin {
    public shortName = 'syntax';
    public name = 'Syntax highlighter';
    public viewerType = ViewerType.Syntax;
    public enabled = true;
    public extraExtensions: string[] = [];
    public extensions: { [index: string]: boolean } = {};

    constructor() {
        for (const ext in Ext2Lang) {
            if ({}.hasOwnProperty.call(Ext2Lang, ext)) {
                this.extensions[ext] = true;
            }
        }
    }
}
