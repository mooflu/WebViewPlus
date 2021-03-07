import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { ModelViewerElement } from '@google/model-viewer';

import { IPlugin } from './PluginInterface';
import useStore from '@hooks/useStore';

ModelViewerElement._dummy_ = undefined; // access imported ModelViewerElement so it's not tree shaken

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            height: '100%',
            '& model-viewer': {
                width: '100%',
                height: '100%',
            },
        },
    })
);

const ModelViewerViewer: React.FC = () => {
    const classes = useStyles();
    const fileUrl = useStore((state) => state.fileUrl);

    return (
        <div className={classes.root}>
            <model-viewer camera-controls src={fileUrl} />
        </div>
    );
};

export class ModelViewerPlugin implements IPlugin {
    public shortName = 'ModelViewer';
    public name = 'Google model-viewer';
    public extensions = new Set<string>();
    public viewer = (<ModelViewerViewer />);

    constructor() {
        this.extensions.add('gltf');
        this.extensions.add('glb');
    }
}
