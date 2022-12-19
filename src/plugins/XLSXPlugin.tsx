import { IPlugin, ViewerType } from './PluginInterface';

// supported formats by SheetJs:
// https://docs.sheetjs.com/docs/miscellany/formats

export class XLSXPlugin implements IPlugin {
    public shortName = 'xlsx';
    public name = 'Tabular data (XLSX, CSV, TSV)';
    public extensions = new Set<string>();
    public viewerType = ViewerType.Tabular;

    constructor() {
        this.extensions.add('xlsx');
        this.extensions.add('csv');
        this.extensions.add('tsv');
    }
}
