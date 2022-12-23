import { IPlugin, ViewerType } from './PluginInterface';

export class IFramePlugin implements IPlugin {
    public shortName = 'iframe';
    public viewerType = ViewerType.IFrame;
    public enabled = true;
    public extraExtensions: string[] = [];
    public extensions: { [index: string]: boolean } = {
        htm: true,
        html: true,
        mht: true,
        mhtml: true,
        pdf: true,
    };
}
