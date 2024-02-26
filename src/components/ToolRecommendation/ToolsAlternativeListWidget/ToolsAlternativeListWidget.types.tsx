export interface ToolsAlternativeListTableData {
    id: number;
    odd: boolean;
    img: string;
    designation: string;
    toolFamily: string;
    strategy: string;
    stock: string;
    MMR: number;
    Gradetype: string;
    Grade: string;
    Shanktype: string;
    Dc: number;
    ZEFP: number;
    APMX: number;
    Re: number;
}

export interface ToolsAlternativeListColumnData {
    dataKey: keyof ToolsAlternativeListTableData;
    label: string;
    numeric?: boolean;
    width: number;
}