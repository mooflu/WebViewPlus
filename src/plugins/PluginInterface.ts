export interface IPlugin {
    shortName: string;
    name: string;
    extensions: Set<string>;
    viewer: JSX.Element;
}
