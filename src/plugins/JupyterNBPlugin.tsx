import { IPlugin, ViewerType } from './PluginInterface';

export class JupyterNBPlugin implements IPlugin {
    public shortName = 'jupyter';
    public viewerType = ViewerType.Jupyter;
    public enabled = true;
    public extraExtensions: string[] = [];
    public extensions: { [index: string]: boolean } = {
        ipynb: true,
    };
}
