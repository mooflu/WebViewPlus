import { IPlugin, ViewerType } from './PluginInterface';

export class ModelViewerPlugin implements IPlugin {
    public shortName = 'ModelViewer';
    public name = '3D model viewer';
    public extensions = new Set<string>();
    public viewerType = ViewerType.Model3D;
    public enabled = true;

    constructor() {
        this.extensions.add('gltf');
        this.extensions.add('glb');
        this.extensions.add('obj');
        this.extensions.add('fbx');
    }
}
