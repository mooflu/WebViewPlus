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
        overflow: 'hidden',
    } as SxProps,
    zoomValue: {
        position: 'absolute',
        top: 8,
        right: 8,
    } as SxProps,
};

const ADJUST_ZOOM_TO = 0.85; // zoom to fit to occupy 85% of max width|height

interface TransformSettings {
    zoom: number;
    minZoom: number;
    maxZoom: number;
    zoomToFit: number;
    translateX: number;
    translateY: number;
    isDrag: boolean;
}

const defaultTransform: TransformSettings = {
    zoom: 1,
    minZoom: 1,
    maxZoom: 1,
    zoomToFit: 1,
    translateX: 0,
    translateY: 0,
    isDrag: false,
};

const ImageViewer: React.FC = () => {
    const theme = useTheme();
    const fileName = useStore(state => state.fileName);
    const fileUrl = useStore(state => state.fileUrl);
    const transformRef = React.useRef<TransformSettings>({ ...defaultTransform });
    const imgRef = React.useRef<HTMLImageElement>(null);
    const [zoom, setZoom] = React.useState(1);
    const [translate, setTranslate] = React.useState({ x: 0, y: 0 });

    const updateZoomSettings = (z: number) => {
        transformRef.current.zoom = z;
        transformRef.current.zoomToFit = z;
        transformRef.current.minZoom = Math.min(1, z / 10);
        transformRef.current.maxZoom = Math.max(10, z * 10);
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

    React.useEffect(() => {
        const handleResize = (e: UIEvent) => {
            const zoomToFit = getZoomToFit();
            updateZoomSettings(zoomToFit);
            setZoom(transformRef.current.zoom);
        };

        const handleMouseDown = (e: MouseEvent) => {
            transformRef.current.isDrag = true;
            e.stopPropagation();
            e.preventDefault();
            return false;
        };

        const handleMouseUp = (e: MouseEvent) => {
            transformRef.current.isDrag = false;
            e.stopPropagation();
            e.preventDefault();
            return false;
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (transformRef.current.isDrag) {
                transformRef.current.translateX += e.movementX;
                transformRef.current.translateY += e.movementY;
                setTranslate({ x: transformRef.current.translateX, y: transformRef.current.translateY });
            }
            e.stopPropagation();
            e.preventDefault();
            return false;
        };

        const handleScroll = (e: WheelEvent) => {
            const { zoom, minZoom, maxZoom, zoomToFit, translateX, translateY } = transformRef.current;
            const newZoom = Math.max(minZoom, Math.min(zoom - (e.deltaY * (0.001 * zoomToFit)), maxZoom));

            const wcw = window.innerWidth / 2;
            const wch = window.innerHeight / 2;

            // mouse position with origin in lower left
            const mx = e.x;
            const my = window.innerHeight - e.y;

            // center of image
            const icx = translateX + wcw;
            const icy = -translateY + wch;

            // vector from center of image to mouse pointer
            const dx = mx - icx;
            const dy = my - icy;

            // scale the vector to the newZoom
            const dx2 = dx / zoom * newZoom;
            const dy2 = dy / zoom * newZoom;

            // adjust translate by the difference
            const ddx = (dx2 - dx);
            const ddy = (dy2 - dy);

            transformRef.current.translateX -= ddx;
            transformRef.current.translateY += ddy;
            setTranslate({ x: transformRef.current.translateX, y: transformRef.current.translateY });

            transformRef.current.zoom = newZoom;
            setZoom(transformRef.current.zoom);

            e.stopPropagation();
            e.preventDefault();
            return false;
        };

        const handleKeydown = (e: KeyboardEvent) => {
            const { zoom, minZoom, maxZoom, zoomToFit } = transformRef.current;
            let newZoom = zoom;
            if (e.key === '0') {
                newZoom = getZoomToFit();
                transformRef.current.translateX = 0;
                transformRef.current.translateY = 0;
                setTranslate({ x: transformRef.current.translateX, y: transformRef.current.translateY });
            } else if (e.key === '1') {
                newZoom = 1;
            } else if (e.key === '+') {
                newZoom = Math.max(minZoom, Math.min(zoom + (0.1 * zoomToFit), maxZoom));
            } else if (e.key === '-') {
                newZoom = Math.max(minZoom, Math.min(zoom - (0.1 * zoomToFit), maxZoom));
            }
            transformRef.current.zoom = newZoom;
            setZoom(transformRef.current.zoom);
        };

        window.addEventListener('wheel', handleScroll, { passive: false });
        window.addEventListener('keydown', handleKeydown);
        window.addEventListener('resize', handleResize);
        window.addEventListener('mousedown', handleMouseDown, { passive: false });
        window.addEventListener('mouseup', handleMouseUp, { passive: false });
        window.addEventListener('mousemove', handleMouseMove, { passive: false });
        return () => {
            window.removeEventListener('wheel', handleScroll);
            window.removeEventListener('keydown', handleKeydown);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    React.useEffect(() => {
        transformRef.current = { ...defaultTransform };
        setTranslate({ x: transformRef.current.translateX, y: transformRef.current.translateY });

        const zoomToFit = getZoomToFit();
        updateZoomSettings(zoomToFit);
        setZoom(transformRef.current.zoom);
    }, [fileUrl]);

    const onImageLoad = () => {
        const zoomToFit = getZoomToFit();
        updateZoomSettings(zoomToFit);
        setZoom(transformRef.current.zoom);
    };

    return (
        <Box component="div" sx={classes.root}>
            <img
                ref={imgRef}
                alt={fileName}
                src={fileUrl}
                style={{ transform: `translateX(${translate.x}px) translateY(${translate.y}px) scale(${zoom})` }}
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
