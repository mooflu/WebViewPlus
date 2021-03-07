declare module 'comma-separated-values';
declare module 'notebookjs';

declare module '@google/model-viewer';
namespace JSX {
    interface IntrinsicElements {
        'model-viewer': ModelViewerJSX &
            React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement>,
                HTMLElement
            >;
    }
}

interface ModelViewerJSX {
    src: string;
    // ... others
}
