import React from 'react';

import EPubViewerSettings from '@components/Settings/EPubViewerSettings';

import { IPlugin, ViewerType } from './PluginInterface';

export class EPubPlugin implements IPlugin {
    public shortName = 'epub';
    public viewerType = ViewerType.EPub;
    public enabled = true;
    public extraExtensions: string[] = [];
    public extensions: { [index: string]: boolean } = { epub: true };
    public customSettings = <EPubViewerSettings />;
}
