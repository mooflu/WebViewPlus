import React from 'react';
import ReactDataGrid from 'react-data-grid';
import XLSX from 'xlsx';

import { IPlugin } from './PluginInterface';
import useStore from '@hooks/useStore';
import CSV2RowData from '@utils/CSV2RowData';

const XLSXViewer: React.FC = () => {
    const fileContentBin = useStore((state) => state.fileContent);
    var data = new Uint8Array(fileContentBin as ArrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });

    // TODO: add a dropdown to select active sheet
    const csvContent = XLSX.utils.sheet_to_csv(
        workbook.Sheets[workbook.SheetNames[0]]
    );

    const { rows, columns } = CSV2RowData(csvContent);

    return <ReactDataGrid columns={columns} rows={rows} rowHeight={22} />;
};

export class XLSXPlugin implements IPlugin {
    public shortName = 'xlsx';
    public name = 'Microsoft Excel Spreadsheet (XLSX)';
    public extensions = new Set<string>();
    public viewer = (<XLSXViewer />);

    constructor() {
        this.extensions.add('xlsx');
    }
}
