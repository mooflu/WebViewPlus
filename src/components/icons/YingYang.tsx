import React from 'react';

import { SvgIcon, SvgIconProps } from '@mui/material';

const YingYang = (props: SvgIconProps) => {
    return (
        <SvgIcon {...props}>
            <circle cx="12" cy="12" r="11.75" fill="#fff" />
            <path d="m12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 0.3c-6.462 0-11.7 5.238-11.7 11.7s5.238 11.7 11.7 11.7c-3.231 0-5.85-3.231-5.85-5.7 0-3.231 2.619-6 5.85-6s6-3.231 6-6c0-3.231-2.769-5.7-6-5.7zm0 19.65c1.077 0 1.95-0.8732 1.95-1.95s-0.8732-1.95-1.95-1.95-1.95 0.8732-1.95 1.95 0.8732 1.95 1.95 1.95zm0-15.99c-1.127 0-2.04 0.9134-2.04 2.04s0.9133 2.04 2.04 2.04 2.04-0.9134 2.04-2.04-0.9133-2.04-2.04-2.04z" fillRule="evenodd" />
        </SvgIcon>
    );
};

export default YingYang;
