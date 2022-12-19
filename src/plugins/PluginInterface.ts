export enum ViewerType {
    Unknown,
    Tabular,
    SVG,
    Syntax,
    Model3D,
    Markdown,
    IFrame,
    // Jupyter,
}

export interface IPlugin {
    shortName: string;
    name: string;
    extensions: Set<string>;
    viewerType: ViewerType;
}
