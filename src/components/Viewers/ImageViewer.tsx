import React from 'react';
import ExifReader from 'exifreader';

import { Box, SxProps, Typography, useTheme } from '@mui/material';

import useStore from '@hooks/useStore';
import { ImageRendering, ZoomBehaviour } from '@utils/types';
import { log } from '@utils/log';
import ExifInfo from '@components/Viewers/ExifInfo';

const classes = {
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    },
    zoomValue: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
} satisfies Record<string, SxProps>;

const ADJUST_ZOOM_TO = 1; // zoom to fit to occupy 100% of max width|height

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
    zoom: 1.5,
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
    const fileContent = useStore(state => state.fileContent);
    const pixelated = useStore(state => state.pixelated);
    const lastZoom = useStore(state => state.zoom);
    const newImageZoomBehaviour = useStore(state => state.newImageZoomBehaviour);
    const resizeImageZoomBehaviour = useStore(state => state.resizeImageZoomBehaviour);
    const togglePixelated = useStore(state => state.actions.togglePixelated);
    const transformRef = React.useRef<TransformSettings>({ ...defaultTransform });
    const containerRef = React.useRef<HTMLDivElement>(null);
    const imgRef = React.useRef<HTMLImageElement>(null);
    const [zoom, setZoom] = React.useState(1);
    const [translate, setTranslate] = React.useState({ x: 0, y: 0 });
    const [tags, setTags] = React.useState(null as ExifReader.Tags | null);

    React.useEffect(() => {
        updateZoomSettings(lastZoom);
        setZoom(lastZoom);
        return () => {
            useStore.setState({ zoom: transformRef.current.zoom }); // remember zoom across mounts
        };
    }, []);

    const updateZoomSettings = (z: number) => {
        transformRef.current.zoom = z;
        transformRef.current.zoomToFit = z;
        transformRef.current.minZoom = Math.min(1, z / 10);
        transformRef.current.maxZoom = Math.max(10, z * 10);
    };

    const getZoomToFit = () => {
        if (!imgRef.current) {
            return 0;
        }
        const iw = imgRef.current.width;
        const ih = imgRef.current.height;
        if (iw === 0 || ih === 0) {
            return 0;
        }
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
            transformRef.current.zoomToFit = getZoomToFit();
            updateZoomSettings(transformRef.current.zoomToFit);
            if (resizeImageZoomBehaviour === ZoomBehaviour.Zoom1To1) {
                transformRef.current.zoom = 1;
                setZoom(transformRef.current.zoom);
            } else if (resizeImageZoomBehaviour === ZoomBehaviour.ZoomToFit) {
                setZoom(transformRef.current.zoomToFit);
            }
        };

        const handleMouseDown = (e: MouseEvent) => {
            transformRef.current.isDrag = true;
            // prevent bubbling so it doesn't start a native drag'n drop operation
            e.stopPropagation();
            e.preventDefault();
            return false;
        };

        const handleMouseUp = (e: MouseEvent) => {
            transformRef.current.isDrag = false;
            return false;
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (transformRef.current.isDrag) {
                transformRef.current.translateX += e.movementX;
                transformRef.current.translateY += e.movementY;
                setTranslate({ x: transformRef.current.translateX, y: transformRef.current.translateY });
            }
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
            let newZoom: number | null = null;
            if (e.key === '0') {
                newZoom = getZoomToFit();
                transformRef.current.translateX = 0;
                transformRef.current.translateY = 0;
                setTranslate({ x: transformRef.current.translateX, y: transformRef.current.translateY });
            } else if (e.key === '1') {
                newZoom = 1;
            } else if (e.key === '2') {
                newZoom = 2;
            } else if (e.key === '3') {
                newZoom = 3;
            } else if (e.key === '4') {
                newZoom = 4;
            } else if (e.key === '5') {
                newZoom = 5;
            } else if (e.key === '6') {
                newZoom = 6;
            } else if (e.key === '7') {
                newZoom = 7;
            } else if (e.key === '8') {
                newZoom = 8;
            } else if (e.key === '9') {
                newZoom = 9;
            } else if (e.key === '+') {
                newZoom = Math.max(minZoom, Math.min(zoom + (0.1 * zoomToFit), maxZoom));
            } else if (e.key === '-') {
                newZoom = Math.max(minZoom, Math.min(zoom - (0.1 * zoomToFit), maxZoom));
            }
            if (e.key === 'p') {
                togglePixelated();
                return;
            }

            if (newZoom) {
                transformRef.current.zoom = newZoom;
                setZoom(transformRef.current.zoom);
            }
        };

        const el = containerRef.current;
        if (!el) {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            return () => {};
        }
        // wheel & mousedown on the plugin container element,
        // so when the setting dialog is open while this plugin is active, you can
        // - select a textbox in the settings
        // - scroll in settings without changing zoom
        el.addEventListener('wheel', handleScroll, { passive: false });
        el.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('keydown', handleKeydown);
        window.addEventListener('resize', handleResize);
        return () => {
            el.removeEventListener('wheel', handleScroll);
            el.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('keydown', handleKeydown);
            window.removeEventListener('resize', handleResize);
        };
    }, [containerRef, newImageZoomBehaviour, resizeImageZoomBehaviour]);

    React.useEffect(() => {
        if (newImageZoomBehaviour === ZoomBehaviour.Zoom1To1) {
            transformRef.current.zoom = 1;
            setZoom(transformRef.current.zoom);
        } else if (newImageZoomBehaviour === ZoomBehaviour.ZoomToFit) {
            transformRef.current = { ...defaultTransform };
            setTranslate({ x: transformRef.current.translateX, y: transformRef.current.translateY });

            const zoomToFit = getZoomToFit();
            updateZoomSettings(zoomToFit);
            setZoom(transformRef.current.zoom);
        }
    }, [fileUrl]);

    React.useEffect(() => {
        setTags(null);
        const readTags = async () => {
            if (fileContent && fileContent instanceof ArrayBuffer) {
                const eTags = await ExifReader.load(fileContent);
                delete eTags.MakerNote;
                delete eTags.Thumbnail;
                delete eTags.UserComment;
                delete eTags.MPEntry;
                setTags(eTags);
            }
        };
        readTags().catch(reason => log(`ExifReader: ${reason}`));
    }, [fileContent]);

    const onImageLoad = () => {
        if (newImageZoomBehaviour === ZoomBehaviour.Zoom1To1) {
            transformRef.current.zoom = 1;
            setZoom(transformRef.current.zoom);
        } else if (newImageZoomBehaviour === ZoomBehaviour.ZoomToFit) {
            const zoomToFit = getZoomToFit();
            updateZoomSettings(zoomToFit);
            setZoom(transformRef.current.zoom);
        }
    };

    return (
        <>
            <Box component="div" ref={containerRef} sx={classes.root}>
                <img
                    ref={imgRef}
                    alt={fileName}
                    src={fileUrl}
                    style={{
                        transform: `translateX(${translate.x}px) translateY(${translate.y}px) scale(${zoom})`,
                        imageRendering: pixelated ? ImageRendering.Pixelated : ImageRendering.Auto,
                    }}
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
            {tags && (
                <ExifInfo tags={tags} />
            )}
        </>
    );
};

export default ImageViewer;
