import React from 'react';
import { type Rendition, type Contents } from 'epubjs';
import { ReactReader, ReactReaderStyle, type IReactReaderStyle } from 'react-reader';

import { Box } from '@mui/material';
import { grey } from '@mui/material/colors';

import useStore from '@hooks/useStore';

const lightTheme: IReactReaderStyle = {
    ...ReactReaderStyle,
    container: {
        ...ReactReaderStyle.container,
        zIndex: '0',
    },
    tocArea: {
        ...ReactReaderStyle.tocArea,
        backgroundColor: grey[400], // toc panel background color
    },
    tocAreaButton: {
        ...ReactReaderStyle.tocAreaButton,
        color: grey[900], // toc entry color
    },
    tocButtonBar: {
        ...ReactReaderStyle.tocButtonBar,
        background: grey[900], // button to open toc (bars foreground)
    },
    tocButtonExpanded: {
        ...ReactReaderStyle.tocButton,
        background: 'none', // button to close toc (bars background)
    },
    arrow: {
        ...ReactReaderStyle.arrow,
        color: grey[900],
    },
    readerArea: {
        ...ReactReaderStyle.readerArea,
        // setting font color here doesn't work -> doing it in updateTheme
        backgroundColor: grey[200],
        textDecoration: 'none',
    },
};

const darkTheme: IReactReaderStyle = {
    ...ReactReaderStyle,
    container: {
        ...ReactReaderStyle.container,
        zIndex: '0',
    },
    tocArea: {
        ...ReactReaderStyle.tocArea,
        backgroundColor: grey[800], // toc panel background color
    },
    tocAreaButton: {
        ...ReactReaderStyle.tocAreaButton,
        color: grey[200], // toc entry color
    },
    tocButtonBar: {
        ...ReactReaderStyle.tocButtonBar,
        background: grey[200], // button to open toc (bars foreground)
    },
    tocButtonExpanded: {
        ...ReactReaderStyle.tocButton,
        background: 'none', // button to close toc (bars background)
    },
    arrow: {
        ...ReactReaderStyle.arrow,
        color: grey[200],
    },
    readerArea: {
        ...ReactReaderStyle.readerArea,
        // setting font color here doesn't work -> doing it in updateTheme
        backgroundColor: grey[900],
        textDecoration: 'none',
    },
};

function updateTheme(rendition: Rendition, isDark: boolean, ePubFontSize: number, ePubCustomFont: string) {
    const themes = rendition.themes;
    let themeSettings = {};
    const fontSize = ePubFontSize ? `${ePubFontSize}px !important` : 'initial !important';
    const fontFamily = ePubCustomFont ? `${ePubCustomFont} !important` : 'dummy-default !important';

    if (isDark) {
        themeSettings = {
            a: {
                color: grey[200],
                'text-decoration': 'none',
            },
            'a:link': {
                color: grey[200],
                'text-decoration': 'none',
            },
            'a:visited ': {
                color: grey[200],
                'text-decoration': 'none',
            },
            'a:active ': {
                color: grey[500],
                'text-decoration': 'none',
            },
            'a:hover': {
                color: grey[500],
                'text-decoration': 'none',
            },
        };
        themes.override('color', grey[400]);
    } else {
        themeSettings = {
            a: {
                color: grey[900],
                'text-decoration': 'none',
            },
            'a:link': {
                color: grey[900],
                'text-decoration': 'none',
            },
            'a:visited ': {
                color: grey[900],
                'text-decoration': 'none',
            },
            'a:active ': {
                color: grey[700],
                'text-decoration': 'none',
            },
            'a:hover': {
                color: grey[700],
                'text-decoration': 'none',
            },
        };
        themes.override('color', grey[900]);
    }
    themeSettings = {
        ...themeSettings,
        span: {
            'font-size': fontSize,
            'font-family': fontFamily,
        },
        div: {
            'font-size': fontSize,
            'font-family': fontFamily,
        },
        p: {
            'font-size': fontSize,
            'font-family': fontFamily,
            'font-weight': 'normal',
        },
        body: {
            'font-size': fontSize,
            'font-family': fontFamily,
            'font-weight': 'normal',
            'background-color': 'transparent !important',
        },
    };
    themes.default(themeSettings);
}

const EPubViewer: React.FC = () => {
    const rendition = React.useRef<Rendition | undefined>(undefined);
    const fileContent = useStore(state => state.fileContent as ArrayBuffer);
    const ePubFontSize = useStore(state => state.ePubFontSize);
    const ePubCustomFont = useStore(state => state.ePubCustomFont);
    const isDark = useStore(state => state.isDark);
    const [location, setLocation] = React.useState<string | number>(0);

    React.useEffect(() => {
        if (rendition.current) {
            updateTheme(rendition.current, isDark, ePubFontSize, ePubCustomFont);
        }
    }, [ePubFontSize, ePubCustomFont]);

    React.useEffect(() => {
        if (rendition.current) {
            updateTheme(rendition.current, isDark, ePubFontSize, ePubCustomFont);
        }
    }, [isDark]);

    return (
        <Box component="div" sx={{ width: '100%', height: '100%' }}>
            <ReactReader
                url={fileContent}
                location={location}
                locationChanged={(epubcfi: string) => setLocation(epubcfi)}
                readerStyles={isDark ? darkTheme : lightTheme}
                epubOptions={{ spread: 'none' }} // single column
                getRendition={(_rendition) => {
                    updateTheme(_rendition, isDark, ePubFontSize, ePubCustomFont);
                    _rendition.hooks.content.register((content: Contents) => {
                        content.document.addEventListener('wheel', (e: WheelEvent) => {
                            if (e.deltaY > 0) {
                                _rendition.next();
                            } else {
                                _rendition.prev();
                            }
                        });
                    });
                    rendition.current = _rendition;
                }}
            />
        </Box>
    );
};

export default EPubViewer;
