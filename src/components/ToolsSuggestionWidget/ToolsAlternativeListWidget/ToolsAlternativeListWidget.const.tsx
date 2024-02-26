import { ToolsAlternativeListColumnData } from "./ToolsAlternativeListWidget.types";

export const toolsAlternativeListColumns: ToolsAlternativeListColumnData[] = [
    {
        width: 200,
        label: "Designation",
        dataKey: "designation",
    },
    {
        width: 120,
        label: "Tool family",
        dataKey: "toolFamily",
    },
    {
        width: 120,
        label: "Strategy",
        dataKey: "strategy",
    },
    {
        width: 120,
        label: "MRR",
        dataKey: "MMR",
        numeric: true,
    },
    {
        width: 120,
        label: "Grade",
        dataKey: "Grade",
    },
    {
        width: 120,
        label: "Shanktype",
        dataKey: "Shanktype",
    },
    {
        width: 120,
        label: "Dc",
        dataKey: "Dc",
        numeric: true,
    },
    {
        width: 120,
        label: "ZEFP",
        dataKey: "ZEFP",
        numeric: true,
    },
    {
        width: 120,
        label: "APMX",
        dataKey: "APMX",
        numeric: true,
    },
    {
        width: 120,
        label: "Re",
        dataKey: "Re",
        numeric: true,
    }
];