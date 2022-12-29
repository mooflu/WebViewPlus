import { IPlugin, ViewerType } from './PluginInterface';

export class EpubPlugin implements IPlugin {
    public shortName = 'epub';
    public viewerType = ViewerType.Epub;
    public enabled = true;
    public extraExtensions: string[] = [];
    public extensions: { [index: string]: boolean } = {
        epub: true,
    };
}
