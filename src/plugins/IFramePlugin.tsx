import { IPlugin, ViewerType } from './PluginInterface';

export class IFramePlugin implements IPlugin {
    public shortName = 'iframe';
    public name = 'Native via iframe';
    public extensions = new Set<string>();
    public viewerType = ViewerType.IFrame;

    constructor() {
        this.extensions.add('html');
        this.extensions.add('htm');
        this.extensions.add('mht');
        this.extensions.add('mhtml');
        this.extensions.add('pdf');
        this.extensions.add('webp');
    }
}
