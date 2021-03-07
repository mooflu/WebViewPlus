import React from 'react';
import svgPanZoom from 'svg-pan-zoom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { IPlugin } from './PluginInterface';
import useStore from '@hooks/useStore';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            height: '100%',
            '& SVG': {
                width: '100%',
                height: '100%',
            },
        },
    })
);

const SVGViewer: React.FC = () => {
    const classes = useStyles();
    const container = React.useRef<HTMLDivElement>(null);
    const fileContent = useStore((state) => state.fileContent) as string;

    React.useEffect(() => {
        if (container.current && container.current.children.length) {
            const svgElement = container.current.children[0] as HTMLElement;
            svgPanZoom(svgElement, {
                zoomScaleSensitivity: 0.5,
            });
        }
    }, [container]);

    return (
        <div
            className={classes.root}
            ref={container}
            dangerouslySetInnerHTML={{ __html: fileContent }}
        ></div>
    );
};

export class SVGPlugin implements IPlugin {
    public shortName = 'svg';
    public name = 'Scalable Vector Graphics (SVG)';
    public extensions = new Set<string>();
    public viewer = (<SVGViewer />);

    constructor() {
        this.extensions.add('svg');
    }
}
