import CSV from 'comma-separated-values';

const CSV2RowData = (data: string) => {
    const rows: any = [];
    const columns: any = [];

    new CSV(data).forEach((array: Array<any>) => {
        if (columns.length < 1) {
            array.forEach((cell: any, idx: number) => {
                columns.push({
                    key: `key-${idx}`,
                    name: cell,
                    resizable: true,
                    sortable: true,
                    filterable: true,
                });
            });
        } else {
            const row: any = {};
            array.forEach((cell: any, idx: number) => {
                row[`key-${idx}`] = cell;
            });
            rows.push(row);
        }
    });

    return { rows, columns };
};

export default CSV2RowData;
