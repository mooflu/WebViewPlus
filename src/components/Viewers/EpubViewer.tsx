import React from 'react';
import ePub from 'epubjs';

import { Box } from '@mui/material';

import useStore from '@hooks/useStore';

const EpubViewer: React.FC = () => {
    const fileContent = useStore(state => state.fileContent);
    const containerRef = React.useRef<HTMLDivElement>();

    React.useEffect(() => {
        if (fileContent && containerRef.current) {
            const book = ePub(fileContent);
            book.loaded.navigation.then(function(toc){
                console.log(toc);
                const r = book.renderTo(containerRef.current, { method: 'continuous', width: '100%', height: '100%' });
                r.display();
            });
        }
    }, [fileContent, containerRef]);

    return (
        <Box component="div" ref={containerRef} sx={{ height: '100%' }} />
    );
};

export default EpubViewer;
