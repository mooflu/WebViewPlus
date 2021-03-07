import React from 'react';
import ReactDataGrid from 'react-data-grid';

import { IPlugin } from './PluginInterface';
import useStore from '@hooks/useStore';
import CSV2RowData from '@utils/CSV2RowData';

const CSVViewer: React.FC = () => {
    const fileContent = useStore((state) => state.fileContent);

    const { rows, columns } = CSV2RowData(fileContent as string);

    return <ReactDataGrid columns={columns} rows={rows} rowHeight={22} />;
};

export class CSVPlugin implements IPlugin {
    public shortName = 'csv';
    public name = 'Comma Separated Values (CSV)';
    public extensions = new Set<string>();
    public viewer = (<CSVViewer />);

    constructor() {
        this.extensions.add('csv');
    }
}
