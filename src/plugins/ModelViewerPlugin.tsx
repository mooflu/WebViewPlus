import { IPlugin, ViewerType } from './PluginInterface';

export class ModelViewerPlugin implements IPlugin {
    public shortName = 'modelViewer';
    public viewerType = ViewerType.Model3D;
    public enabled = true;
    public extraExtensions: string[] = [];
    public extensions: { [index: string]: boolean } = {
        gltf: true,
        glb: true,
        obj: true,
        fbx: true,
    };
}
