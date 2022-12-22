import React from 'react';

import { Box, SxProps, Typography, useTheme } from '@mui/material';

import useStore from '@hooks/useStore';

const classes = {
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    } as SxProps,
    zoomValue: {
        position: 'absolute',
        top: 8,
        right: 8,
    } as SxProps,
};

const ADJUST_ZOOM_TO = 0.85;

interface ZoomSettings {
    zoom: number;
    minZoom: number;
    maxZoom: number;
    zoomToFit: number;
}

const ImageViewer: React.FC = () => {
    const theme = useTheme();
    const fileName = useStore(state => state.fileName);
    const fileUrl = useStore(state => state.fileUrl);
    const zoomRef = React.useRef<ZoomSettings>({
        zoom: 1,
        minZoom: 1,
        maxZoom: 1,
        zoomToFit: 1,
    });
    const imgRef = React.useRef<HTMLImageElement>(null);
    const [zoom, setZoom] = React.useState(1);

    React.useEffect(() => {
        window.addEventListener('wheel', handleScroll, { capture: true, passive: false });
        window.addEventListener('keydown', handleKeydown);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('wheel', handleScroll);
            window.removeEventListener('keydown', handleKeydown);
            window.removeEventListener('resize', handleResize);
        };
    }, [fileUrl]);

    const updateZoomSettings = (z: number) => {
        zoomRef.current.zoom = z;
        zoomRef.current.zoomToFit = z;
        zoomRef.current.minZoom = Math.min(1, z / 10);
        zoomRef.current.maxZoom = Math.max(10, z * 10);
    };

    const onImageLoad = () => {
        const zoomToFit = getZoomToFit();
        updateZoomSettings(zoomToFit);
        setZoom(zoomRef.current.zoom);
    };

    const getZoomToFit = () => {
        const iw = imgRef.current!.width;
        const ih = imgRef.current!.height;
        const iar = iw / ih;
        const ww = window.innerWidth;
        const wh = window.innerHeight;
        const war = ww / wh;
        let startZoom = 1;
        if (iar > war) {
            startZoom = (ww / iw) * ADJUST_ZOOM_TO;
        } else {
            startZoom = (wh / ih) * ADJUST_ZOOM_TO;
        }
        return startZoom;
    };

    const handleResize = React.useCallback((e: UIEvent) => {
        const zoomToFit = getZoomToFit();
        updateZoomSettings(zoomToFit);
        setZoom(zoomRef.current.zoom);
    }, []);

    const handleScroll = React.useCallback((e: WheelEvent) => {
        // TODO: handle zoom to mouse pointer instead of center
        const { zoom, minZoom, maxZoom, zoomToFit } = zoomRef.current;
        const newZoom = Math.max(minZoom, Math.min(zoom - (e.deltaY * (0.001 * zoomToFit)), maxZoom));
        zoomRef.current.zoom = newZoom;
        setZoom(zoomRef.current.zoom);
        e.stopPropagation();
        e.preventDefault();
        return false;
    }, []);

    const handleKeydown = React.useCallback((e: KeyboardEvent) => {
        const { zoom, minZoom, maxZoom, zoomToFit } = zoomRef.current;
        let newZoom = zoom;
        if (e.key === '0') {
            newZoom = getZoomToFit();
        } else if (e.key === '1') {
            newZoom = 1;
        } else if (e.key === '+') {
            newZoom = Math.max(minZoom, Math.min(zoom + (0.1 * zoomToFit), maxZoom));
        } else if (e.key === '-') {
            newZoom = Math.max(minZoom, Math.min(zoom - (0.1 * zoomToFit), maxZoom));
        }
        zoomRef.current.zoom = newZoom;
        setZoom(zoomRef.current.zoom);
    }, []);

    return (
        <Box component="div" sx={classes.root}>
            <img
                ref={imgRef}
                alt={fileName}
                src={fileUrl}
                style={{ transform: `scale(${zoom})` }}
                onLoad={onImageLoad}
            />
            <Box
                component="div"
                sx={classes.zoomValue}
            >
                <Typography
                    variant="h5"
                    sx={{
                        textShadow: `0px 0px 4px ${theme.palette.background.default}`,
                    }}
                >
                    {`${Math.round(zoom * 100)}%`}
                </Typography>
            </Box>
        </Box>
    );
};

export default ImageViewer;
