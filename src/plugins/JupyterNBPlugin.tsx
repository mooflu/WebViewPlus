import { IPlugin, ViewerType } from './PluginInterface';

export class JupyterNBPlugin implements IPlugin {
    public shortName = 'JupyterNB';
    public name = 'Jupyter Notebook';
    public extensions = new Set<string>();
    public viewerType = ViewerType.Jupyter;
    public enabled = true;

    constructor() {
        this.extensions.add('ipynb');
    }
}
