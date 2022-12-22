import { IPlugin, ViewerType } from './PluginInterface';

export class ImagePlugin implements IPlugin {
    public shortName = 'image';
    public viewerType = ViewerType.Image;
    public enabled = true;
    public extraExtensions: string[] = [];
    public extensions: { [index: string]: boolean } = {
        png: true,
        apng: true,
        jpg: true,
        jpeg: true,
        gif: true,
        tif: true,
        tiff: true,
    };
}
