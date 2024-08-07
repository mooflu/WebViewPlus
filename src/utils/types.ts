export enum ImageRendering {
    Auto = 'auto',
    Pixelated = 'pixelated',
}

export enum ZoomBehaviour {
    KeepZoom = 'keepZoom',
    ZoomToFit = 'zoomToFit',
    Zoom1To1 = 'zoom1To1',
}

export interface InitData
{
    langCode: string;
    detectEncoding: boolean;
    showTrayIcon: boolean;
    useTransparency: boolean;
}
