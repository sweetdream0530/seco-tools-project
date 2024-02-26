/* eslint-disable react/display-name */
import * as React from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TableVirtuoso } from "react-virtuoso";

import styles from "./ToolsAlternativeListWidget.scss";
import { toolsAlternativeListColumns } from "./ToolsAlternativeListWidget.const";
import { ToolsAlternativeListTableData } from "./ToolsAlternativeListWidget.types";
import { CustomTableComponents } from "./CustomTableComponents";

function fixedHeaderContent() {
    return (
        <TableRow className={styles.tableHeader}>
            {toolsAlternativeListColumns.map((column) => (
                <TableCell
                    key={column.dataKey}
                    variant="head"
                    align={column.numeric || false ? "right" : "left"}
                    style={{ width: column.width }}
                >
                    {column.label}
                </TableCell>
            ))}
        </TableRow>
    );
}

function rowContent(_index: number, row: ToolsAlternativeListTableData) {
    return (
        <React.Fragment>
            {toolsAlternativeListColumns.map((column) => (
                <TableCell
                    key={column.dataKey}
                    align={column.numeric || false ? "right" : "left"}
                    className={row.odd ? styles.recomendedTools : ""}
                >
                    {row[column.dataKey]}
                </TableCell>
            ))}
        </React.Fragment>
    );
}

export default function ToolsAlternativeListWidget(props: any) {
    const { tools } = props;

    let idx = 0;
    let idy = 0;
    const rows: ToolsAlternativeListTableData[] = [];
    tools.forEach((toolAssemblies: any) => {
        const assemblyRoot = toolAssemblies.toolAssemblies.at(0);
        const attributes = {} as any;
        assemblyRoot?.tools.forEach((assembly: any) => {
            let row = {} as ToolsAlternativeListTableData;
            idx += 1;
            row.id = idx;
            row.designation = `${assembly.role}: ${assembly.designation}`;
            row.strategy = toolAssemblies.strategy.displayName;
            row.stock = "1 / 0";
            row.toolFamily = assemblyRoot.toolFamily;
            row.odd = idy === 0 || idy % 2 === 0;
            assembly.toolAttributes.forEach((attr: any) => {
                attributes[attr.name] = attr.value;
            });
            assemblyRoot.cuttingDataResult.forEach((attr: any) => {
                attributes[attr.name] = attr.value;
            });
            if (assembly.role === "Holder") {
                row = { ...row, ...attributes };
            }
            rows.push(row);
        });
        idy++;
    });

    return (
        <Paper style={{ height: 400, width: "100%" }}>
            <TableVirtuoso
                data={rows}
                components={CustomTableComponents}
                fixedHeaderContent={fixedHeaderContent}
                itemContent={rowContent}
            />
        </Paper>
    );
}