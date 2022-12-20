import { IPlugin, ViewerType } from './PluginInterface';

export class MarkdownPlugin implements IPlugin {
    public shortName = 'md';
    public name = 'Markdown';
    public extensions = new Set<string>();
    public viewerType = ViewerType.Markdown;
    public enabled = true;

    constructor() {
        this.extensions.add('md');
        this.extensions.add('markdown');
    }
}
