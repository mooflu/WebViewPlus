import React from 'react';
import svgPanZoom from 'svg-pan-zoom';

import { Box, SxProps } from '@mui/material';

import useStore from '@hooks/useStore';

const classes = {
    root: {
        width: '100%',
        height: '100%',
        lineHeight: 0,
        '& SVG': {
            width: '100%',
            height: '100%',
        },
    },
} satisfies Record<string, SxProps>;

const SVGViewer: React.FC = () => {
    const container = React.useRef<HTMLDivElement>(null);
    const fileContent = useStore(state => state.fileContent) as string;

    React.useEffect(() => {
        if (container.current && container.current.children.length) {
            const svgElement = container.current.children[0] as HTMLElement;
            svgPanZoom(svgElement, {
                zoomScaleSensitivity: 0.5,
            });
        }
    }, [container]);

    return (
        <Box
            component="div"
            sx={classes.root}
            ref={container}
            dangerouslySetInnerHTML={{ __html: fileContent }}
        />
    );
};

export default SVGViewer;
