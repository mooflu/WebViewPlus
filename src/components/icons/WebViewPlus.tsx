import React from 'react';

import { SvgIcon, SvgIconProps } from '@mui/material';

const WebViewPlus = (props: SvgIconProps) => {
    return (
        <SvgIcon {...props} viewBox="0 0 80 85.71">
            <defs>
                <linearGradient id="linear-gradient" x1="23.91" x2="348" y1="93.93" y2="418.1" gradientTransform="matrix(.1687 0 0 .1687 26.68 -1.012)" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#28afea" offset="0" />
                    <stop stopColor="#037cd6" offset="1" />
                </linearGradient>
                <linearGradient id="linear-gradient-2" x1="226.9" x2="357" y1="191" y2="321" gradientTransform="matrix(.1687 0 0 .1687 -23.3 -9.424)" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#0078d3" offset="0" />
                    <stop stopColor="#0d569d" offset="1" />
                </linearGradient>
                <linearGradient id="linear-gradient-4" x1="369.7" x2="460.6" y1="333.8" y2="424.7" gradientTransform="matrix(.1687 0 0 .1687 -23.3 -9.424)" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#737a80" offset="0" />
                    <stop stopColor="#5e6369" offset="1" />
                </linearGradient>
                <filter id="filter1394" x="-.1267" y="-.1267" width="1.253" height="1.253" colorInterpolationFilters="sRGB">
                    <feGaussianBlur stdDeviation="5.278089" />
                </filter>
                <filter id="filter962" x="-.06869" y="-.03689" width="1.137" height="1.074" colorInterpolationFilters="sRGB">
                    <feGaussianBlur stdDeviation="1.1922741" />
                </filter>
                <filter id="filter966" x="-.04801" y="-.04799" width="1.096" height="1.096" colorInterpolationFilters="sRGB">
                    <feGaussianBlur stdDeviation="1.0479315" />
                </filter>
            </defs>
            <path d="m71.52 4.296-35.49 6.298a2.688 2.688 0 0 0-2.219 2.646v59.58a2.688 2.688 0 0 0 2.219 2.646l35.49 6.298a3.361 3.361 0 0 0 3.946-3.302v-70.86a3.361 3.361 0 0 0-3.946-3.302z" filter="url(#filter962)" opacity=".3" strokeWidth=".1687" style={{ isolation: 'isolate' }} />
            <path d="m71.99 3.447-35.49 6.298a2.688 2.688 0 0 0-2.219 2.646v59.58a2.688 2.688 0 0 0 2.219 2.646l35.49 6.298a3.361 3.361 0 0 0 3.946-3.302v-70.86a3.361 3.361 0 0 0-3.946-3.302z" fill="url(#linear-gradient)" strokeWidth=".1687" style={{ isolation: 'isolate' }} />
            <g transform="matrix(.1687 0 0 .1687 -.4583 -.08377)" filter="url(#filter1394)" opacity=".3" style={{ mixBlendMode: 'normal' }}>
                <rect x="320.1" y="192.2" width="100" height="30" ry="15" />
                <rect transform="rotate(90)" x="157.2" y="-385.1" width="100" height="30" ry="15" />
            </g>
            <g strokeWidth=".1687">
                <circle cx="25.95" cy="33.77" r="15.52" fill="url(#linear-gradient-2)" style={{ isolation: 'isolate' }} />
                <path d="m54.23 57.95-9.904-9.904a22.74 22.74 0 0 0 4.291-13.4c-0.04049-12.53-10.3-22.76-22.83-22.78a22.84 22.84 0 0 0-22.86 22.87c0.00844 12.53 10.24 22.79 22.77 22.83a22.74 22.74 0 0 0 13.4-4.285l9.906 9.906a3.695 3.695 0 0 0 5.23 0 3.695 3.695 0 0 0-0.0051-5.232zm-43.91-23.23a15.45 15.45 0 1 1 15.45 15.45 15.45 15.45 0 0 1-15.45-15.45z" filter="url(#filter966)" opacity=".3" style={{ isolation: 'isolate' }} />
                <path d="m36.47 49.51 12.72 12.72a3.695 3.695 0 0 0 5.23 0 3.695 3.695 0 0 0 0-5.23l-12.72-12.72z" fill="url(#linear-gradient-4)" style={{ isolation: 'isolate' }} />
            </g>
            <g fill="#dbdbdb">
                <path d="m25.95 10.92a22.84 22.84 0 1 0 22.84 22.84 22.84 22.84 0 0 0-22.84-22.84zm0 38.3a15.45 15.45 0 1 1 15.45-15.45 15.45 15.45 0 0 1-15.45 15.45z" strokeWidth=".1687" style={{ isolation: 'isolate' }} />
                <rect x="54.31" y="31.24" width="16.87" height="5.062" ry="2.531" />
                <rect transform="rotate(90)" x="25.33" y="-65.28" width="16.87" height="5.062" ry="2.531" />
            </g>
        </SvgIcon>
    );
};

export default WebViewPlus;
