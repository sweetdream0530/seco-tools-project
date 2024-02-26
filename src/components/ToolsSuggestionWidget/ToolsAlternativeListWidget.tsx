import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso, TableComponents } from 'react-virtuoso';

import styles from './ToolsAlternativeListWidget.scss';

interface Data {
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

interface ColumnData {
  dataKey: keyof Data;
  label: string;
  numeric?: boolean;
  width: number;
}

function createData(
  id: number,
  odd: boolean,
  img: string,
  designation: string,
  toolFamily: string,
  strategy: string,
  stock: string,
  MMR: number,
  Gradetype: string,
  Grade: string,
  Shanktype: string,
  Dc: number,
  ZEFP: number,
  APMX: number,
  Re: number,
): Data {
  return {
    id,
    odd,
    img,
    designation,
    toolFamily,
    strategy,
    stock,
    MMR,
    Gradetype,
    Grade,
    Shanktype,
    Dc,
    ZEFP,
    APMX,
    Re,
  };
}

const columns: ColumnData[] = [
  {
    width: 200,
    label: 'Designation',
    dataKey: 'designation',
  },
  {
    width: 120,
    label: 'Tool family',
    dataKey: 'toolFamily',
  },
  {
    width: 120,
    label: 'Strategy',
    dataKey: 'strategy',
  },
  {
    width: 120,
    label: 'MRR',
    dataKey: 'MMR',
    numeric: true,
  },
  {
    width: 120,
    label: 'Grade',
    dataKey: 'Grade',
  },
  {
    width: 120,
    label: 'Shanktype',
    dataKey: 'Shanktype',
  },
  {
    width: 120,
    label: 'Dc',
    dataKey: 'Dc',
    numeric: true,
  },
  {
    width: 120,
    label: 'ZEFP',
    dataKey: 'ZEFP',
    numeric: true,
  },
  {
    width: 120,
    label: 'APMX',
    dataKey: 'APMX',
    numeric: true,
  },
  {
    width: 120,
    label: 'Re',
    dataKey: 'Re',
    numeric: true,
  }
];

const VirtuosoTableComponents: TableComponents<Data> = {
  Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
  ),
  TableHead,
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
  TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableBody className={styles.alternativeList} {...props} ref={ref} />
  )),
};

function fixedHeaderContent() {
  return (
    <TableRow className={styles.tableHeader}>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          variant="head"
          align={column.numeric || false ? 'right' : 'left'}
          style={{ width: column.width }}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );
}

function rowContent(_index: number, row: Data) {
  return (
    <React.Fragment>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          align={column.numeric || false ? 'right' : 'left'}
          className={row.odd ? styles.recomendedTools : ''}
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
  const rows: Data[] = [];
  tools.forEach((toolAssemblies: any) => {
    const assemblyRoot = toolAssemblies.toolAssemblies.at(0);
    const attributes = {};
    assemblyRoot?.tools.forEach((assembly: any) => {
      let row = {} as Data;
      idx += 1;
      row.id = idx;
      row.designation = `${assembly.role}: ${assembly.designation}`;
      row.strategy = toolAssemblies.strategy.displayName;
      row.stock = `1 / 0`;
      row.toolFamily = assemblyRoot.toolFamily;
      row.odd = idy === 0 || idy % 2 === 0;
      assembly.toolAttributes.forEach((attr: any) => {
        // @ts-ignore
        attributes[attr.name] = attr.value
      })
      assemblyRoot.cuttingDataResult.forEach((attr: any) => {
        // @ts-ignore
        attributes[attr.name] = attr.value
      });
      if (assembly.role === 'Holder') {
        row = {...row, ...attributes};
      }
      rows.push(row);
    })
    idy++;
  })

  return (
    <Paper style={{ height: 400, width: '100%' }}>
      <TableVirtuoso
        data={rows}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={rowContent}
      />
    </Paper>
  );
}