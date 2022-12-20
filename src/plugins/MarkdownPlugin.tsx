import { IPlugin, ViewerType } from './PluginInterface';

export class MarkdownPlugin implements IPlugin {
    public shortName = 'md';
    public name = 'Markdown';
    public viewerType = ViewerType.Markdown;
    public enabled = true;
    public extraExtensions: string[] = [];
    public extensions: { [index: string]: boolean } = {
        md: true,
        markdown: true,
    };
}
