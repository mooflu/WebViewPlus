import { IPlugin, ViewerType } from './PluginInterface';

// supported formats by SheetJs:
// https://docs.sheetjs.com/docs/miscellany/formats

export class XLSXPlugin implements IPlugin {
    public shortName = 'xlsx';
    public name = 'Tabular data';
    public viewerType = ViewerType.Tabular;
    public enabled = true;
    public extraExtensions: string[] = [];
    public extensions: { [index: string]: boolean } = {
        xlsx: true,
        csv: true,
        tsv: true,
    };
}
