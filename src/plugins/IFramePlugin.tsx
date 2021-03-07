import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { IPlugin } from './PluginInterface';
import useStore from '@hooks/useStore';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            height: '100%',
        },
    })
);

const IFrameViewer: React.FC = () => {
    const classes = useStyles();
    const fileUrl = useStore((state) => state.fileUrl);
    return (
        <div className={classes.root}>
            <iframe
                title='iframe preview'
                width='100%'
                height='100%'
                frameBorder='0'
                src={fileUrl}
            ></iframe>
        </div>
    );
};

export class IFramePlugin implements IPlugin {
    public shortName = 'iframe';
    public name = 'Native via iframe';
    public extensions = new Set<string>();
    public viewer = (<IFrameViewer />);

    constructor() {
        this.extensions.add('html');
        this.extensions.add('htm');
        this.extensions.add('mht');
        this.extensions.add('mhtml');
        this.extensions.add('pdf');
        this.extensions.add('webp');
    }
}
