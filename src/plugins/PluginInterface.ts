export enum ViewerType {
    Unknown,
    Tabular,
    SVG,
    Syntax,
    Model3D,
    Markdown,
    IFrame,
    Jupyter,
    Image,
    Font,
}

export interface IPlugin {
    shortName: string;
    viewerType: ViewerType;
    enabled: boolean;
    extensions: { [index: string]: boolean };
    extraExtensions: string[];
    customSettings?: JSX.Element;
}
