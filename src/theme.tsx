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
                            '*::-webkit-scrollbar': {
                                width: '10px', // width of vertical scrollbar
                                height: '10px', // height of horizontal scrollbar
                            },
                            /* color of the tracking area
                            '*::-webkit-scrollbar-track': {
                                backgroundColor: '#888',
                            },
                            */
                            '*::-webkit-scrollbar-thumb': {
                                backgroundColor: isDark ? '#444' : '#ccc',
                                borderRadius: '5px',
                                border: isDark ? '2px solid #222' : '2px solid #fff',
                            },
                            '*::-webkit-scrollbar-corner': {
                                backgroundColor: isDark ? '#222' : '#fff',
                            },
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
                            color: isDark ? '#aaa !important' : '#333 !important',
                        },
                        '.rdg-header-row': {
                            backgroundColor: isDark ? '#115 !important' : '#ccf !important',
                        },
                        '.rdg-header-row:hover': {
                            filter: isDark ? 'brightness(1.2)' : 'brightness(0.8)',
                        },
                        '.rdg-row-odd': {
                            backgroundColor: isDark ? '#222 !important' : '#fff !important',
                        },
                        '.rdg-row-odd:hover': {
                            filter: isDark ? 'brightness(1.2)' : 'brightness(0.8)',
                        },
                        '.rdg-row-even': {
                            backgroundColor: isDark ? '#333 !important' : '#eee !important',
                        },
                        '.rdg-row-even:hover': {
                            filter: isDark ? 'brightness(1.2)' : 'brightness(0.8)',
                        },
                    },
                },
                MuiTab: {
                    styleOverrides: {
                        root: {
                            borderBottom: isDark ? '1px solid #333' : '1px solid #eee',
                            '&.Mui-selected': {
                                backgroundColor: isDark ? '#282828' : '#e8e8e8',
                            },
                        },
                    },
                },
                MuiDialogTitle: {
                    styleOverrides: {
                        root: {
                            backgroundColor: isDark ? '#282828' : '#ddd',
                            borderBottom: isDark ? '1px solid #444' : '1px solid #aaa',
                        },
                    },
                },
                MuiTypography: {
                    styleOverrides: {
                        caption: {
                            color: isDark ? '#666' : '#aaa',
                        },
                    },
                },
            },
        }));
    }, [isDark]);

    return theme;
};

export default useTheme;
