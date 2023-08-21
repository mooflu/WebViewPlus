import { IPlugin, ViewerType } from './PluginInterface';

export class FontPlugin implements IPlugin {
    public shortName = 'font';
    public viewerType = ViewerType.Font;
    public enabled = true;
    public extraExtensions: string[] = [];
    public extensions: { [index: string]: boolean } = {
        ttf: true,
        otf: true,
        woff: true,
        woff2: true,
    };
}
