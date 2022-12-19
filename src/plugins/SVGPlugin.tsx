import { IPlugin, ViewerType } from './PluginInterface';

export class SVGPlugin implements IPlugin {
    public shortName = 'svg';
    public name = 'Scalable Vector Graphics (SVG)';
    public extensions = new Set<string>();
    public viewerType = ViewerType.SVG;

    constructor() {
        this.extensions.add('svg');
    }
}
