// https://nbformat.readthedocs.io/en/latest/format_description.html
export type Notebook = {
    cells: Cell[];
    metadata: NotebookMetadata;
    nbformat: number;
    nbformat_minor: number;
}

export type NotebookMetadata = {
    kernelspec: Kernelspec;
    authors: { name: string }[];
}

export type Kernelspec = {
    name: string;
    display_name?: string;
    language?: string;
}

// https://nbformat.readthedocs.io/en/latest/format_description.html#cell-types
export enum CellType {
    Code = 'code',
    Markdown = 'markdown',
    Raw = 'raw',
}

export type BaseCell = {
    execution_count: number | null;
}

export type CodeCell = BaseCell & {
    cell_type: CellType.Code;
    source: string[];
    execution_count: number | null;
    metadata: {
        collapsed: boolean;
        scrolled: boolean | 'auto';
    };
    outputs?: Output[];
}

export type MarkdownCell = {
    cell_type: CellType.Markdown;
    source: string | string[];
    metadata: Record<string, never>;
    attachments?: Record<string, Record<string, string>>[];
    // 'test.png: { 'image/png': 'base64 encoded data' }
    // in markdown ref'd as "![inline image](attachment:test.png)"
}

export type RawCell = {
    cell_type: CellType.Raw;
    metadata: {
        format: string; // mime/type
    };
    source: string[];
}

export type Cell = CodeCell | MarkdownCell | RawCell;

// https://nbformat.readthedocs.io/en/latest/format_description.html#cell-metadata
export type CellMetadata = {
    collapsed?: boolean;
    scrolled?: boolean | 'auto';
    format?: string; // mime/type
    name?: string;
    tags?: string[];
    // ...
}

export enum OutputType {
    Stream = 'stream',
    Error = 'error',
    ExecuteResult = 'execute_result',
    DisplayData = 'display_data',
}

export type Output = StreamOutput | ExecuteResultOutput | DisplayDataOutput | ErrorOutput;

export type StreamOutput = {
    output_type: OutputType.Stream;
    name: 'stdout' | 'stderr'
    text: string[];
}

export type ErrorOutput = {
    output_type: OutputType.Error;
    ename: string;
    evalue: string;
    traceback: string[];
}

export type ExecuteResultOutput = {
    output_type: OutputType.ExecuteResult;
    execution_count: number;
    data: Data;
    metadata: OutputMetadata;
}

export type DisplayDataOutput = {
    output_type: OutputType.DisplayData;
    data: Data;
    metadata: OutputMetadata;
}

export type Data = Record<string, any>;

export type OutputMetadata = {
    'image/png': {
        width: number;
        height: number;
    };
}

// Helpers
export const joinData = (data: string | string[]) => {
    return Array.isArray(data) ? data.join('') : data;
};
