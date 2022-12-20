import { IPlugin, ViewerType } from './PluginInterface';

export class IFramePlugin implements IPlugin {
    public shortName = 'iframe';
    public name = 'Native via iframe';
    public viewerType = ViewerType.IFrame;
    public enabled = true;
    public extraExtensions: string[] = [];
    public extensions: { [index: string]: boolean } = {
        html: true,
        htm: true,
        mht: true,
        mhtml: true,
        pdf: true,
        webp: true,
    };
}
