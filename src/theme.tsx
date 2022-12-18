import React from 'react';

import { useMediaQuery, createTheme, Theme } from '@mui/material';
import { indigo, grey } from '@mui/material/colors';

const useTheme = () => {
    const [theme, setTheme] = React.useState<Theme>(createTheme());
    const isDark = useMediaQuery('(prefers-color-scheme: dark)');

    React.useEffect(() => {
        setTheme(createTheme({
            palette: {
                mode: isDark ? 'dark' : 'light',
                ...(isDark
                ? {
                    // palette values for dark mode
                    primary: indigo,
                    divider: indigo[700],
                    background: {
                        default: grey[900],
                        paper: grey[900],
                    },
                } : {
                    // palette values for light mode
                }),
            },
            components: {
                MuiCssBaseline: {
                    styleOverrides: {
                        html: {
                            width: '100%',
                            height: '100%',
                            margin: 0,
                        },
                        body: {
                            width: '100%',
                            height: '100%',
                            lineHeight: 0,
                        },
                        '#root': {
                            width: '100%',
                            height: '100%',
                        },
                        // react-syntax-highlighter
                        'span[data="textLine"]': {
                            display: 'block',
                        },
                        'span[data="textLine"]:hover': {
                            backgroundColor: isDark ? '#444' : '#eee',
                        },
                        // react-data-grid custom style
                        '.rdg': {
                            fontFamily: 'monospace',
                            fontSize: '1rem !important',
                            height: '100% !important',
                        },
                        '.rdg-header-row:not(:hover)': {
                            backgroundColor: isDark ? '#338 !important' : '#eef !important',
                        },
                        '.rdg-header-row:hover': {
                            backgroundColor:  isDark ? 'lighten(#338, 10%) !important' : 'darken(#eef, 10%) !important',
                        },
                        '.rdg-row-odd:not(:hover)': {
                            backgroundColor:  isDark ? '#883 !important' : '#ffe !important',
                        },
                        '.rdg-row-odd:hover': {
                            backgroundColor:  isDark ? 'lighten(#883, 10%) !important' : 'darken(#ffe, 10%) !important',
                        },
                        '.rdg-row-even:not(:hover)': {
                            backgroundColor:  isDark ? '#383 !important' : '#efe !important',
                        },
                        '.rdg-row-even:hover': {
                            backgroundColor:  isDark ? 'lighten(#383, 10%) !important' : 'darken(#efe, 10%) !important',
                        },
                    },
                },
            },
        }));
    }, [isDark]);

    return theme;
}

export default useTheme;
