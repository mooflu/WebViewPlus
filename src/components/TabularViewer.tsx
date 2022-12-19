import React from 'react';
import ReactDataGrid from 'react-data-grid';
import { read, utils } from 'xlsx';

import useStore from '@hooks/useStore';
import CSV2RowData from '@utils/CSV2RowData';

const TabularViewer: React.FC = () => {
    const fileContent = useStore((state) => state.fileContent);
    const type = fileContent instanceof ArrayBuffer ? 'binary' : 'string';
    const workbook = read(fileContent, { type });

    // TODO: add a dropdown to select active sheet
    const csvContent = utils.sheet_to_csv(
        workbook.Sheets[workbook.SheetNames[0]]
    );

    const { rows, columns } = CSV2RowData(csvContent);

    return <ReactDataGrid columns={columns} rows={rows} rowHeight={22} />;
};

export default TabularViewer;
