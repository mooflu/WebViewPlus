import { IPlugin, ViewerType } from './PluginInterface';

export class SVGPlugin implements IPlugin {
    public shortName = 'svg';
    public name = 'SVG';
    public viewerType = ViewerType.SVG;
    public enabled = true;
    public extraExtensions: string[] = [];
    public extensions: { [index: string]: boolean } = {
        svg: true,
    };
}
