import { IPlugin, ViewerType } from './PluginInterface';

export class SVGPlugin implements IPlugin {
    public shortName = 'svg';
    public name = 'SVG';
    public extensions = new Set<string>();
    public viewerType = ViewerType.SVG;
    public enabled = true;

    constructor() {
        this.extensions.add('svg');
    }
}
